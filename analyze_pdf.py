# import requests
# import json
# import fitz  # PyMuPDF

# # Parse through PDF text
# def extract_text_from_pdf(path):
#     doc = fitz.open(path)
#     text = ""
#     for page in doc:
#         text += page.get_text() + "\n"
#     return text
# pdf_path = "building-accessory.pdf"
# pdf_text = extract_text_from_pdf(pdf_path)
# pdf_text = pdf_text[:16000]  # Optional
# print(pdf_text[:500])  # Preview first 500 chars

# # Make prompt
# prompt = f"""
# You are an expert compliance and language reviewer for construction permits.
# Your task is to evaluate a permit document and respond with a structured JSON object that includes a compliance score and highlights any potential issues in grammar, clarity, or regulation violations.
# The main compliance regulations you are looking for are not follow California's energy efficiency requirements, surpassing a budget of $500,000, incorrect soil conditions, missing information, and anything that violates California building regulation. 
# Only include elements in the JSON if it you are certain it is in violation of a rule. 
# Please follow this format exactly and return only the raw JSON — no commentary, no code blocks, no markdown formatting.
# The JSON should contain:
# {{
#   "complianceScore": number (0-100),        // An overall score representing the permit's effectiveness
#   "grammarIssues": [                        // Grammar/spelling problems with explanations
#     {{
#       "quote": string,                      // Exact quote from the permit text
#       "explanation": string                 // Why it is incorrect and how to fix it
#     }}
#   ],
#   "ambiguityIssues": [                      // Sections that are unclear, vague, or could be misinterpreted
#     {{
#       "quote": string,
#       "explanation": string
#     }}
#   ],
#   "complianceIssues": [                     // Regulatory or policy-related issues
#     {{
#       "quote": string,
#       "explanation": string
#     }}
#   ]
# }}
# Do not include any additional comments, formatting, or natural language outside the JSON object.
# Below is the content of the permit to evaluate:
# \"\"\"{pdf_text}\"\"\"
# """


# # LLM API Call
# response = requests.post(
#   url="https://openrouter.ai/api/v1/chat/completions",
#   headers={
#       "Authorization": "Bearer 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",  # replace with your actual key
#       "Content-Type": "application/json",
#   },
#   data=json.dumps({
#         "model": "google/gemini-2.0-flash-001",
#         "messages": [
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ]
#   })
# )

# # Print results
# print(response)
# response_data = response.json()
# print(json.dumps(response_data, indent=2))

# if "choices" in response_data and len(response_data["choices"]) > 0:
#     model_response = response_data["choices"][0]["message"]["content"]
#     print("\n📄 Model's response:")
#     print(model_response)

# import os
# import sys
# import fitz  # PyMuPDF

# def extract_text_from_pdf(pdf_path):
#     print(f"Received PDF path: {pdf_path}")
#     if not os.path.exists(pdf_path):
#         raise FileNotFoundError(f"File not found: {pdf_path}")
#     print(f"Opening file: {pdf_path}")
#     doc = fitz.open(pdf_path)  # <-- FIXED THIS LINE
#     text = ""
#     for page in doc:
#         text += page.get_text()
#     return text

# if __name__ == "__main__":
#     pdf_path = sys.argv[1]
#     print(f"Received file path: {pdf_path}")  # Log the received path

#     # Check if file exists
#     if not os.path.exists(pdf_path):
#         print(f"Error: File not found at {pdf_path}")
#     else:
#         print(f"File exists: {pdf_path}")
    
#     # Extract text from PDF
#     try:
#         pdf_text = extract_text_from_pdf(pdf_path)
#         print(pdf_text)  # Output text or other processing
#     except FileNotFoundError as e:
#         print(str(e))


import os
import sys
import json
import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    print(f"Received PDF path: {pdf_path}", file=sys.stderr)  # Logs go to stderr
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")
    print(f"Opening file: {pdf_path}", file=sys.stderr)
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    print(f"Received file path: {pdf_path}", file=sys.stderr)

    if not os.path.exists(pdf_path):
        print(f"Error: File not found at {pdf_path}", file=sys.stderr)
        sys.exit(1)

    try:
        pdf_text = extract_text_from_pdf(pdf_path)

        # Example fake analysis
        result = {
            "score": 85,
            "issues": ["Missing cover page", "No ADA statement"],
            "content": pdf_text[:500]  # limit text if it's large
        }

        print(json.dumps(result))  # <-- Node.js will parse this
    except Exception as e:
        print(json.dumps({ "error": str(e) }))
        sys.exit(1)
