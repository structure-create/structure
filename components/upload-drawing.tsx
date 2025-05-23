"use client"

import type React from "react"
import { useState } from "react"
import { Upload, FileText, Loader2, PencilRuler } from "lucide-react"
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

export function UploadDrawing() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingUpload, setPendingUpload] = useState<(() => Promise<void>) | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)

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

  const handleEmailSubmit = async (email: string) => {
    localStorage.setItem('userEmail', email)
    setShowEmailModal(false)
    if (pendingUpload) {
      await pendingUpload()
    }
  }

  const handleDrawingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) return

    // Get user's email from localStorage or show modal
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) {
      setPendingUpload(async () => {
        setIsUploading(true)
        setError(null)
        try {
          const arrayBuffer = await file.arrayBuffer()
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
          const page = await pdf.getPage(1)
          const viewport = page.getViewport({ scale: 2 })
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          canvas.width = viewport.width
          canvas.height = viewport.height
          await page.render({ canvasContext: context!, viewport }).promise
          const base64Image = canvas.toDataURL("image/jpeg").split(",")[1]

          const emailAfterModal = localStorage.getItem('userEmail'); // Get email again after modal submission

          const response = await fetch("/api/anthropic", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-email": emailAfterModal || '' // Use the email from localStorage
            },
            body: JSON.stringify({ base64Image }),
          });

          if (response.status === 429) {
            const data = await response.text(); // Read as text for 429 errors
            setError(data || 'Upload limit reached')
            setIsUploading(false)
            return
          }

          if (!response.ok) { // Handle other non-2xx responses
             const errorData = await response.text();
             throw new Error(`Upload failed with status ${response.status}: ${errorData}`);
          }

          const data = await response.json(); // Parse as JSON for successful responses
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
                { category: "Electrical",  items: parsed.Electrical .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
                { category: "Zoning",      items: parsed.Zoning     .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
                { category: "Plumbing",    items: parsed.Plumbing   .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
                { category: "Mechanical",  items: parsed.Mechanical .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
                { category: "Ambiguity",   items: parsed.Ambiguity  .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
              ].filter(s => s.items.length > 0),
            }; 
          
            setAnalysis(analysisFormatted);
          } catch (err) {
            console.error("Failed to parse LLM JSON:", err);
            setError("There was an error parsing the model's response.");
          }
        } catch (err) {
          console.error("Failed to analyze the PDF. Please try again.")
          // Safely access the error message
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred during analysis.");
          }
        } finally {
          setIsUploading(false)
        }
      })
      setShowEmailModal(true)
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Load PDF
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const page = await pdf.getPage(1)

      // Render page to canvas
      const viewport = page.getViewport({ scale: 2 }) // Adjust scale for quality
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      canvas.width = viewport.width
      canvas.height = viewport.height

      await page.render({ canvasContext: context!, viewport }).promise

      // Convert canvas to base64 image
      const base64Image = canvas.toDataURL("image/jpeg").split(",")[1]

      // Send API call
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail // Include email in header
        },
        body: JSON.stringify({ base64Image }),
      });

      if (response.status === 429) {
        const data = await response.text(); // Read as text for 429 errors
        setError(data || 'Upload limit reached')
        setIsUploading(false)
        return
      }

       if (!response.ok) { // Handle other non-2xx responses
             const errorData = await response.text();
             throw new Error(`Upload failed with status ${response.status}: ${errorData}`);
          }

      const data = await response.json(); // Parse as JSON for successful responses
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
            { category: "Electrical",  items: parsed.Electrical .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
            { category: "Zoning",      items: parsed.Zoning     .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
            { category: "Plumbing",    items: parsed.Plumbing   .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
            { category: "Mechanical",  items: parsed.Mechanical .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
            { category: "Ambiguity",   items: parsed.Ambiguity  .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
          ].filter(s => s.items.length > 0),
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
      console.error("Failed to analyze the PDF. Please try again.")
       // Safely access the error message
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred during analysis.");
        }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section id="upload-drawing" className="w-full py-12 md:py-24 lg:py-32 bg-[var(--background)]">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-navy-900">
              Upload Your Construction Drawing
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
              Get instant analysis and compliance scoring for your architectural drawings
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <Card className="border-2 border-dashed border-gray-200 bg-white">
            <CardContent className="p-6">
              <form onSubmit={handleDrawingSubmit} className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <div className="rounded-full bg-orange-50 p-4">
                    <PencilRuler className="h-8 w-8 text-orange-700" />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-lg font-semibold text-orange-900">Upload your PDF</h3>
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
                      className="bg-orange-700 hover:bg-orange-800 text-white rounded-sm" 
                      disabled={!file || isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Figure"
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
