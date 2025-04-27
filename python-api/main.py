# python-api/main.py

import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

# Load .env or .env.local
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise RuntimeError("Missing OPENROUTER_API_KEY in environment")

class GeminiRequest(BaseModel):
    text: str

app = FastAPI()

@app.post("/api/gemini")
async def gemini_handler(payload: GeminiRequest):
    prompt = f"""
You are an expert compliance and language reviewer for construction permits.
Your task is to evaluate a permit document and respond with a structured JSON object that includes a compliance score and highlights any potential issues in grammar, clarity, or regulation violations.
The main compliance regulations you are looking for are:
  - California's most recent energy efficiency requirements,
  - incorrect soil conditions,
  - missing information,
  - MAJORLY incorrect grammar/spelling,
  - anything that violates California building regulation.
If there are specific codes that are violated then cite the exact code that was violated followed by an explanation as to why/how it was violated.
Only include elements in the JSON if it is in violation of a compliance rule, has incorrect grammar, or is ambiguous.
Please follow this format exactly and return only the raw JSON — no commentary, no code blocks, no markdown formatting.
The JSON should ALWAYS contain:

{{
  "complianceScore": number (0-100),
  "grammarIssues": [{{"quote": string, "explanation": string}}],
  "ambiguityIssues": [{{"quote": string, "explanation": string}}],
  "complianceIssues": [{{"quote": string, "explanation": string}}],
  "codesViolated": [{{"quote": string, "explanation": string}}]
}}

Below is the content of the permit to evaluate:
\"\"\"{payload.text}\"\"\"
"""

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json={
                "model": "google/gemini-2.0-flash-001",
                "messages": [{"role": "user", "content": prompt}],
            },
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )
        resp.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Upstream error: {e}")

    data = resp.json()
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()

    # Strip any ``` fences
    lines = content.splitlines()
    if lines and lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].startswith("```"):
        lines = lines[:-1]
    content = "\n".join(lines).strip()

    return {"success": True, "raw": content}
