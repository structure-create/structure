// OUTDATED - ARCHIVED


"use client"; 

import { useState, ChangeEvent, FormEvent } from "react";

// Define the structure of the analysis result
interface AnalysisResult {
  complianceScore: number;
  grammarIssues: {
    quote: string;
    explanation: string;
  }[];
  ambiguityIssues: {
    quote: string;
    explanation: string;
  }[];
  complianceIssues: {
    quote: string;
    explanation: string;
  }[];
  codesViolated: {
    quote: string;
    explanation: string;
  }[];
}

export default function PdfUpload() {
  // Define the state types
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file input change
  const handlePdfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setPdfFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!pdfFile) {
      setError("Please select a PDF file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);

      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data: AnalysisResult = await response.json();
        setAnalysisResult(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to analyze PDF");
      }
    } catch (err) {
      setError("Error processing the PDF file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze PDF"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {analysisResult && (
        <div>
          <h3>Analysis Result</h3>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
