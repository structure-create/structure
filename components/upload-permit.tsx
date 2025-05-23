// Minimal version
"use client"

import type React from "react"
import { useState } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { analyzePdf } from "@/app/actions"
import { AnalysisResults } from "./analysis-results"
import { 
  checkUploadLimit, 
  recordUpload, 
  generateVerificationCode, 
  verifyCode, 
  markEmailAsVerified,
  isEmailVerified 
} from "@/lib/supabase"

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
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [remainingUploads, setRemainingUploads] = useState<number | null>(null)
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)
  const [hasReachedLimit, setHasReachedLimit] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address")
      return
    }

    try {
      // Check if email is already verified
      const verified = await isEmailVerified(email)
      if (verified) {
        // If verified, proceed with upload limit check
        const { canUpload, remainingUploads } = await checkUploadLimit(email)
        setRemainingUploads(remainingUploads)

        if (!canUpload) {
          setError(`You have reached your upload limit of 3 files. Please contact support for more uploads.`)
          setHasReachedLimit(true)
          return
        }

        setIsEmailSubmitted(true)
        setError(null)
        return
      }

      // If not verified, send verification code
      setIsVerifying(true)
      const code = await generateVerificationCode(email)
      
      // Send verification code via email
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      setIsCodeSent(true)
    } catch (err) {
      console.error("Error in email submission:", err)
      setError("Failed to process your email. Please try again.")
      setIsVerifying(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) {
      setError("Please enter the verification code")
      return
    }

    try {
      const isValid = await verifyCode(email, verificationCode)
      if (!isValid) {
        setError("Invalid verification code. Please try again.")
        return
      }

      // Mark email as verified
      await markEmailAsVerified(email)

      // Check upload limit
      const { canUpload, remainingUploads } = await checkUploadLimit(email)
      setRemainingUploads(remainingUploads)

      if (!canUpload) {
        setError(`You have reached your upload limit of 3 files. Please contact support for more uploads.`)
        setHasReachedLimit(true)
        return
      }

      setIsEmailSubmitted(true)
      setError(null)
    } catch (err) {
      console.error("Error in verification:", err)
      setError("Failed to verify your email. Please try again.")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.type !== "application/pdf") {
      setFile(null)
      setError("Please select a valid PDF file")
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !email) return

    // Double check upload limit before proceeding
    try {
      const { canUpload } = await checkUploadLimit(email)
      if (!canUpload) {
        setError("You have reached your upload limit of 3 files. Please contact support for more uploads.")
        setHasReachedLimit(true)
        return
      }
    } catch (err) {
      setError("Failed to verify upload limit. Please try again.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Record the upload
      await recordUpload(email, file.name)

      const formData = new FormData()
      formData.append("pdf", file)

      // PDF parsing
      const text = await extractTextFromPDF(file)

      // Send API call
      const response = await fetch("/api/gemini_outdated", {
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
            { category: "Electrical",  items: parsed.Electrical .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
            { category: "Zoning",      items: parsed.Zoning     .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
            { category: "Plumbing",    items: parsed.Plumbing   .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
            { category: "Mechanical",  items: parsed.Mechanical .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
            { category: "Ambiguity",   items: parsed.Ambiguity  .map((i: any) => `"${i.quote}" — ${i.explanation}`) },
          ].filter(s => s.items.length > 0),
        };        
      
        setAnalysis(analysisFormatted);
        // Update remaining uploads
        setRemainingUploads(prev => {
          const newCount = prev !== null ? prev - 1 : null
          if (newCount === 0) {
            setHasReachedLimit(true)
          }
          return newCount
        })
      } catch (err) {
        console.error("Failed to parse LLM JSON:", err);
        setError("There was an error parsing the model's response.");
      }
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-navy-900">
            Upload Your Building Plan
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
            Get instant analysis and compliance scoring for your building plans
          </p>
          {remainingUploads !== null && (
            <p className="text-sm text-gray-500">
              You have {remainingUploads} upload{remainingUploads !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>

        <div className="mx-auto max-w-3xl">
          <Card className="border-2 border-dashed border-gray-200 bg-white">
            <CardContent className="p-6">
              {hasReachedLimit ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <div className="space-y-2 text-center">
                    <h3 className="text-lg font-semibold text-orange-900">
                      Upload Limit Reached
                    </h3>
                    <p className="text-sm text-gray-500">
                      You have reached your limit of 3 uploads. Please contact support for more uploads.
                    </p>
                  </div>
                </div>
              ) : !isEmailSubmitted ? (
                <form onSubmit={isVerifying ? handleVerificationSubmit : handleEmailSubmit} className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="space-y-2 text-center">
                      <h3 className="text-lg font-semibold text-orange-900">
                        {isVerifying ? "Enter Verification Code" : "Enter your email to continue"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isVerifying 
                          ? "Please enter the verification code sent to your email"
                          : "We'll verify your email before proceeding"}
                      </p>
                    </div>
                    {!isVerifying ? (
                      <div className="w-full max-w-sm">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                    ) : (
                      <div className="w-full max-w-sm">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter verification code"
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                    )}
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button 
                      type="submit" 
                      className="bg-orange-700 rounded-sm hover:bg-orange-800 text-white"
                    >
                      {isVerifying ? "Verify Code" : "Continue"}
                    </Button>
                  </div>
                </form>
              ) : (
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
                    <Button 
                      type="submit" 
                      className="bg-orange-700 rounded-sm hover:bg-orange-800 text-white" 
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
                </form>
              )}
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