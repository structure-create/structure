import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const runtime = 'nodejs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Obtain text from request header
    const { text } = req.body;

    // Define LLM prompt
    const prompt = `
        You are an expert compliance and language reviewer for construction permits.
        Your task is to evaluate a permit document and respond with a structured JSON object that includes a compliance score and highlights any potential issues in grammar, clarity, or regulation violations.
        The main compliance regulations you are looking for are not following California's most recent energy efficiency requirements, incorrect soil conditions, missing information, MAJORLY incorrect grammar/spelling, and anything that violates California building regulation. 
        If there are specific codes that are violated then cite the exact code that was violated followed by an explanation as to why/how it was violated.
        Only include elements in the JSON if it is in violation of a compliance rule, has incorrect grammar, or is ambiguous. 
        Please follow this format exactly and return only the raw JSON — no commentary, no code blocks, no markdown formatting.
        The JSON should ALWAYS contain:
        {
        "complianceScore": number (0-100),
        "grammarIssues": [
            {
            "quote": string,
            "explanation": string
            }
        ],
        "ambiguityIssues": [
            {
            "quote": string,
            "explanation": string
            }
        ],
        "complianceIssues": [
            {
            "quote": string,
            "explanation": string
            }
        ],
        "codesViolated": [
            {
            "quote": string,
            "explanation": string
            }
        ]
        }
        Below is the content of the permit to evaluate:
        """${text}"""
    `;

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'perplexity/sonar',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
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
    console.log("Model Output: ", modelOutput);

    res.status(200).json({ success: true, raw: modelOutput });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
