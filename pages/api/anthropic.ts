import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const runtime = 'nodejs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Obtain text from request header
    const { base64Image } = req.body;

    // Define LLM prompt
    const prompt = `
      You are an expert reviewer of construction permit drawings.
      
      Your task is to evaluate a construction figure for ADA and general regulation compliance. Return your findings as a strict JSON object. Do not include any extra text, markdown, or commentary — only valid JSON.
      
      For ambiguity issues, include the quote followed by the reason why the drawing was not clear. For compliance issues, include the ADA code violated
      followed by why the code was violated.

      Provide a general summary at the end to explicity state if the drawing is ADA compliant or not.

      Only include elements in the JSON if they are violations or ambiguous.
      
      Here is the required JSON format:
      {
        "complianceScore": number (between 0-100),
        "ambiguityIssues": [
          {
            "quote": string,
            "explanation": string
          }
        ],
        "complianceIssues": [
          {
            "code": string,
            "explanation": string
          }
        ],
        "summary": [
          {
            "summary": string,
          }
        ]
      }
      
      Do not wrap the response in backticks, code blocks, or markdown. Only return the raw JSON.
      
      Analyze the drawing below:
    `;

    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ];

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-opus',
        messages,
        max_tokens: 1000,
        temperature: 0.1,
      },
      {
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
      }
    );

    

    const result = response.data;
    const modelOutput = result.choices?.[0]?.message?.content ?? '';
    // console.log("Model Output: ", modelOutput);
    console.log("Model Output with markers: >>>" + modelOutput + "<<<");


    res.status(200).json({ success: true, raw: modelOutput });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
