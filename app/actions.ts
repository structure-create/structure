"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import * as pdfjs from "pdfjs-dist"

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export async function analyzePdf(formData: FormData) {
  try {
    // Get the PDF file from the form data
    const pdfFile = formData.get("pdf") as File
    if (!pdfFile) {
      throw new Error("No PDF file provided")
    }

    // Convert the file to an ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer()

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise

    // Extract text from all pages
    let fullText = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      fullText += pageText + " "
    }

    // Extract the grading permit application section
    const gradingSection = extractGradingPermitSection(fullText)

    if (!gradingSection) {
      return {
        score: 0,
        issues: [
          {
            category: "Document Analysis Error",
            items: [
              "Could not locate the grading permit application section in the document. Please ensure you've uploaded the correct permit type.",
            ],
          },
        ],
      }
    }

    // Send only the grading section to OpenAI for analysis
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Please analyze this grading permit application section for any compliance or regulatory issues. Identify potential problems, flag them, and provide explanations for each issue. Format your response with clear sections and bullet points for easy reading. Additionally provide back a score out of 100 based on the errors that are apparent in the permit.

Here is the grading permit application section content:
${gradingSection}

Please structure your response in JSON format with the following structure:
{
  "score": number,
  "issues": [
    {
      "category": "string",
      "items": ["string"]
    }
  ]
}`,
    })

    try {
      // Parse the response as JSON
      const analysis = JSON.parse(text)
      return analysis
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError)

      // Return a fallback response if parsing fails
      return {
        score: 0,
        issues: [
          {
            category: "Analysis Error",
            items: ["Could not process the analysis results. Please try again."],
          },
        ],
      }
    }
  } catch (error) {
    console.error("Error analyzing PDF:", error)

    // Return a structured error response
    return {
      score: 0,
      issues: [
        {
          category: "Processing Error",
          items: ["Failed to process the PDF. Please ensure it's a valid document and try again."],
        },
      ],
    }
  }
}

// Function to extract the grading permit application section from the text
function extractGradingPermitSection(text: string): string | null {
  // Case-insensitive search for section headers related to grading permits
  const sectionMarkers = [
    "grading permit application",
    "grading application",
    "grading permit section",
    "grading information",
    "site grading",
  ]

  // Try to find the start of the grading section
  let startIndex = -1
  let usedMarker = ""

  for (const marker of sectionMarkers) {
    const index = text.toLowerCase().indexOf(marker.toLowerCase())
    if (index !== -1 && (startIndex === -1 || index < startIndex)) {
      startIndex = index
      usedMarker = marker
    }
  }

  if (startIndex === -1) {
    // Could not find any grading section
    return null
  }

  // Look for the end of the section - either the next major section header or a reasonable chunk of text
  // Common section headers that might follow the grading section
  const endMarkers = [
    "building permit application",
    "electrical permit",
    "plumbing permit",
    "mechanical permit",
    "zoning information",
    "owner certification",
    "contractor information",
    "certification statement",
  ]

  let endIndex = -1

  for (const marker of endMarkers) {
    // Start looking after the beginning of our section
    const searchText = text.substring(startIndex + usedMarker.length)
    const index = searchText.toLowerCase().indexOf(marker.toLowerCase())

    if (index !== -1 && (endIndex === -1 || index < endIndex)) {
      endIndex = startIndex + usedMarker.length + index
    }
  }

  // If we couldn't find a clear end marker, take a reasonable chunk (3000 characters or to the end)
  if (endIndex === -1) {
    endIndex = Math.min(startIndex + 3000, text.length)
  }

  // Extract the section
  const gradingSection = text.substring(startIndex, endIndex).trim()

  // If the extracted section is too short, it might not be what we're looking for
  if (gradingSection.length < 50) {
    return null
  }

  return gradingSection

}