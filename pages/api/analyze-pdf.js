// pages/api/analyze-pdf.js
import fs from "fs";
import path from "path";
// Remove the node-fetch import since it's not necessary with Node.js 18+
import { IncomingForm } from "formidable";
import { exec } from "child_process";  // To run Python script for PDF processing

export const config = {
  api: {
    bodyParser: false, // We use formidable to handle the body
  },
};

const analyzePdf = async (req, res) => {
  const form = new IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing file" });
    }

    const pdfFile = files.pdf[0];
    if (!pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const scriptPath = path.join(process.cwd(), 'analyze_pdf.py'); // Absolute path to the Python script
    const filePath = path.join(process.cwd(), 'uploads', pdfFile.originalFilename); // Absolute path to the uploaded PDF file

    // // Run a Python script for PDF analysis
    // exec(`python3 ${scriptPath} "${filePath}"`, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error("Error executing Python script:", error);
    //     return res.status(500).json({ error: "Error processing PDF" });
    //   }

    //   const result = JSON.parse(stdout);
    //   return res.status(200).json(result);
    // });
    exec(`python3 ${scriptPath} "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
    
      try {
        const result = JSON.parse(stdout);
        return res.status(200).json(result);
      } catch (err) {
        console.error("Failed to parse output:", stdout);
        return res.status(500).json({ error: 'Invalid output from Python script' });
      }
    });
  });
};


export default analyzePdf;
