"use client"

import type React from "react"
import { useState } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { analyzePdf } from "@/app/actions"
import { AnalysisResults } from "./analysis-results"

import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// Handle PDF
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(" ");
    fullText += text + "\n";
  }
  return fullText.slice(0, 16000); // Truncate if needed
}

export function UploadPermit() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setError(null)
    } else {
      setFile(null)
      setError("Please select a valid PDF file")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      // PDF parsing
      const text = await extractTextFromPDF(file)

      // Send API call
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      console.log("Response:", data);

      // Clean up raw data and read JSON
      const raw = data.raw.trim();
      const cleaned = raw.startsWith("```json") ? raw.slice(7, -3).trim() : raw;

      // Pass into analysis results
      try {
        const parsed = JSON.parse(cleaned);
      
        // Step 3: Transform to match your AnalysisResults format
        const analysisFormatted = {
          score: parsed.complianceScore,
          issues: [
            {
              category: "Grammar Issues",
              items: parsed.grammarIssues.map((issue: any) => `"${issue.quote}" — ${issue.explanation}`),
            },
            {
              category: "Ambiguity Issues",
              items: parsed.ambiguityIssues.map((issue: any) => `"${issue.quote}" — ${issue.explanation}`),
            },
            {
              category: "Compliance Issues",
              items: parsed.complianceIssues.map((issue: any) => `"${issue.quote}" — ${issue.explanation}`),
            },
            {
              category: "Codes Violated",
              items: parsed.codesViolated.map((issue: any) => `"${issue.quote}" — ${issue.explanation}`),
            }
          ].filter((section) => section.items.length > 0),
        };
      
        setAnalysis(analysisFormatted);
      } catch (err) {
        console.error("Failed to parse LLM JSON:", err);
        setError("There was an error parsing the model's response.");
      }

      // Old implementation
      // const result = await analyzePdf(formData)

      // if (
      //   result.score === 0 &&
      //   result.issues.length === 1 &&
      //   (result.issues[0].category.includes("Error") || result.issues[0].category.includes("error"))
      // ) {
      //   // This is an error response
      //   setError(result.issues[0].items[0])
      //   setAnalysis(null)
      // } else {
      //   setAnalysis(result)
      // }
    } catch (err) {
      setError("Failed to analyze the PDF. Please try again.")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section id="upload-permit" className="w-full py-12 md:py-24 lg:py-32 bg-[var(--background)]">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-navy-900">
              Upload Your Construction Permit
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
              Get instant analysis and compliance scoring for your construction permits
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <Card className="border-2 border-dashed border-gray-200 bg-white">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <div className="rounded-full bg-orange-50 p-4">
                    <FileText className="h-8 w-8 text-orange-700" />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-lg font-semibold text-orange-900">Upload your PDF</h3>
                    <p className="text-sm text-gray-500">
                      Drag and drop or click to upload your construction permit PDF
                    </p>
                  </div>
                  <div className="w-full max-w-sm">
                    <label
                      htmlFor="pdf-upload"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-gray-200 bg-white px-6 py-8 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Select PDF file</span>
                      </div>
                      <input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {file && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  )}
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <div className="flex justify-center">
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="bg-orange-700 hover:bg-orange-800 text-white"
                      disabled={!file || isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Permit"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {analysis && <AnalysisResults analysis={analysis} />}
        </div>
      </div>
    </section>
  )
}
