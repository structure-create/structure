// Minimal version
"use client"

import type React from "react"
import { useState } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { analyzePdf } from "@/app/actions"
import { AnalysisResults } from "./analysis-results"
import { EmailModal } from "@/components/email-modal"

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
  const [pendingUpload, setPendingUpload] = useState<(() => Promise<void>) | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setError(null)
      setAnalysis(null); // Clear previous analysis results
    } else {
      setFile(null)
      setError("Please select a valid PDF file")
      setAnalysis(null); // Clear previous analysis results
    }
  }

  const handleEmailSubmit = async (email: string) => {
    localStorage.setItem('userEmail', email)
    setShowEmailModal(false)
    if (file) {
      const dummyEvent = { preventDefault: () => {} } as React.FormEvent;
      await handleSubmit(dummyEvent);
    }
    setPendingUpload(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) return

    // Get user's email from localStorage or show modal
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) {
      setPendingUpload(async () => {
        setIsUploading(true)
        setError(null)
        try {
          const text = await extractTextFromPDF(file)
          const emailAfterModal = localStorage.getItem('userEmail'); // Get email again after modal submission
          const response = await fetch("/api/gemini_outdated", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-email": emailAfterModal || '' // Use the email from localStorage
            },
            body: JSON.stringify({ text }),
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
          console.error(err)
          setError("Failed to analyze the PDF. Please try again.")
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
      const text = await extractTextFromPDF(file)

      // Send API call
      const response = await fetch("/api/gemini_outdated", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail // Include email in header
        },
        body: JSON.stringify({ text }),
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
      setError("Failed to analyze the PDF. Please try again.")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section id="upload-permit" className="w-full py-12 md:py-24 lg:py-32 bg-[var(--background)]">
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false)
          setPendingUpload(null)
        }}
        onSubmit={handleEmailSubmit}
      />
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-navy-900">
            Upload Your Building Plan
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
            Get instant analysis and compliance scoring for your building plans
          </p>
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
                    <h3 className="text-lg font-semibold text-orange-900">
                      Upload your PDF
                    </h3>
                  </div>
                  <label htmlFor="pdf-upload" className="w-full max-w-sm flex cursor-pointer flex-col items-center justify-center rounded-md border border-gray-200 bg-white px-6 py-8 hover:bg-gray-50">
                    <Upload className="mr-2 h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Select PDF file</span>
                    <input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" />
                  </label>
                  {file && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  )}
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <div className="flex justify-center">
                  <Button type="submit" className="bg-orange-700 rounded-sm hover:bg-orange-800 text-white" disabled={!file || isUploading}>
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
              </form>
            </CardContent>
          </Card>

          {analysis && <AnalysisResults analysis={analysis} />}
        </div>
      </div>
    </section>
  )
}


// Proper version
// "use client"

// import React, { useState } from "react"
// import { Upload, FileText, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { AnalysisResults } from "./analysis-results"

// export function UploadPermit() {
//   const [file, setFile] = useState<File | null>(null)
//   const [isUploading, setIsUploading] = useState(false)
//   const [analysis, setAnalysis] = useState<any>(null)
//   const [error, setError] = useState<string | null>(null)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0]
//     if (selectedFile && selectedFile.type === "application/pdf") {
//       setFile(selectedFile)
//       setError(null)
//     } else {
//       setFile(null)
//       setError("Please select a valid PDF file")
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!file) return

//     setIsUploading(true)
//     setError(null)

//     try {
//       // Prepare form-data
//       const formData = new FormData()
//       formData.append("file", file)

//       // Send to backend endpoint
//       const response = await fetch("http://localhost:8000/api/claude", {
//         method: "POST",
//         body: formData,
//       })
//       if (!response.ok) throw new Error(`HTTP ${response.status}`)
//       const data = await response.json()
//       console.log("Response:", data)

//       // Transform into AnalysisResults format
//       const formatted = {
//         score: data.compliance_score,
//         issues: [
//           {
//             category: "Violations",
//             items: data.violations.flatMap((pageObj: any) =>
//               pageObj.violations.map((v: any, idx: number) => (
//                 <div key={`${pageObj.page}-${idx}`} className="mb-6">
//                   <p className="font-bold underline">
//                     {v.violation.citation}
//                   </p>
//                   <p className="mt-1 italic">
//                     &ldquo;{v.violation.quote}&rdquo;
//                   </p>
//                   <p className="mt-1 text-gray-700">
//                     {v.violation.reason}
//                   </p>
//                 </div>
//               ))
//             ),
//           },
//         ],
//       };      

//       setAnalysis(formatted)
//     } catch (err) {
//       console.error(err)
//       setError("Failed to analyze the PDF. Please try again.")
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   return (
//     <section id="upload-permit" className="w-full py-12 md:py-24 lg:py-32 bg-[var(--background)]">
//       <div className="container px-4 md:px-6 mx-auto">
//         <div className="flex flex-col items-center space-y-4 text-center mb-12">
//           <h2 className="text-3xl sm:text-4xl md:text-5xl text-navy-900">
//             Upload Your Construction Permit
//           </h2>
//           <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
//             Get instant analysis and compliance scoring for your construction permits
//           </p>
//         </div>

//         <div className="mx-auto max-w-3xl">
//           <Card className="border-2 border-dashed border-gray-200 bg-white">
//             <CardContent className="p-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="flex flex-col items-center justify-center space-y-4 py-6">
//                   <div className="rounded-full bg-orange-50 p-4">
//                     <FileText className="h-8 w-8 text-orange-700" />
//                   </div>
//                   <div className="space-y-2 text-center">
//                     <h3 className="text-lg font-semibold text-orange-900">
//                       Upload your PDF
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       Drag and drop or click to upload your construction permit PDF
//                     </p>
//                   </div>
//                   <label htmlFor="pdf-upload" className="w-full max-w-sm flex cursor-pointer flex-col items-center justify-center rounded-md border border-gray-200 bg-white px-6 py-8 hover:bg-gray-50">
//                     <Upload className="mr-2 h-4 w-4 text-gray-600" />
//                     <span className="text-sm text-gray-600">Select PDF file</span>
//                     <input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" />
//                   </label>
//                   {file && (
//                     <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
//                       <FileText className="h-4 w-4" />
//                       <span>{file.name}</span>
//                     </div>
//                   )}
//                   {error && <p className="text-sm text-red-500">{error}</p>}
//                 </div>

//                 <div className="flex justify-center">
//                   <Button type="submit" className="bg-orange-700 hover:bg-orange-800 text-white" disabled={!file || isUploading}>
//                     {isUploading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Analyzing...
//                       </>
//                     ) : (
//                       "Analyze Permit"
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>

//           {analysis && <AnalysisResults analysis={analysis} />}
//         </div>
//       </div>
//     </section>
//   )
// }