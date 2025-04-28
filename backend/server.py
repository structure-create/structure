import os
import io
import json
import base64
import boto3
import requests
import traceback

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pdf2image import convert_from_path
from PyPDF2 import PdfReader

# === Configuration ===
API_KEY           = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing environment variable: OPENROUTER_API_KEY is required for LLM calls")
API_URL           = "https://openrouter.ai/api/v1/chat/completions"
DPI               = 200
PAGES_PER_BATCH   = 1
BUCKET_NAME       = "lamc-codes"

# LLM model identifiers
MODEL_SEGMENT     = "google/gemini-2.0-flash-001"
MODEL_DESCRIPTION = "google/gemini-2.0-flash-001"
MODEL_COMPLIANCE  = "google/gemini-2.0-flash-001"

# === AWS S3 client ===
session = boto3.Session()
s3 = session.client('s3')

# === Helper: Base64 encode a single PDF page ===
def encode_page_to_base64(pdf_path: str, page_num: int, dpi: int = DPI) -> str:
    images = convert_from_path(
        pdf_path,
        dpi=dpi,
        first_page=page_num,
        last_page=page_num
    )
    buf = io.BytesIO()
    images[0].save(buf, format="JPEG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")

# === Helper: Safe LLM call ===
def call_openrouter(system_prompt: str, model: str, user_message: str = "Analyze.") -> list:
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_message},
        ],
        "max_tokens": 8000,
        "temperature": 0,
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type":  "application/json",
    }
    try:
        resp = requests.post(API_URL, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as e:
        print(f"LLM request error: {e}")
        raise HTTPException(502, f"LLM request failed: {e}")

    if "error" in data:
        err = data["error"].get("message", data["error"])
        print(f"LLM API returned error: {err}")
        raise HTTPException(502, f"LLM API error: {err}")

    choices = data.get("choices")
    if not choices:
        print(f"LLM API unexpected response, no choices: {data}")
        raise HTTPException(502, f"LLM returned no choices")

    raw = choices[0]["message"]["content"]
    clean = raw.strip().lstrip("```json").rstrip("```").strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError as e:
        snippet = raw[:200].replace("\n", " ")
        print(f"JSON parse error: {e}, raw: {snippet}")
        raise HTTPException(502, f"Invalid JSON from LLM: {e}")

def extract_text_from_page(reader, page_num: int) -> str:
    try:
        page = reader.pages[page_num - 1]  # PyPDF2 pages are 0-indexed
        return page.extract_text() or ""
    except Exception:
        return ""

# === Step 1: Generate segments ===
def generate_segments(pdf_path: str) -> list[dict]:
    reader = PdfReader(pdf_path)
    total_pages = len(reader.pages)
    segments = []

    for start in range(1, total_pages + 1, PAGES_PER_BATCH):
        end = min(start + PAGES_PER_BATCH - 1, total_pages)
        page_list = list(range(start, end + 1))
        b64_batch = [encode_page_to_base64(pdf_path, p) for p in page_list]
        text_batch = [extract_text_from_page(reader, p) for p in page_list]

        system_prompt_query = (
            "You must output STRICT JSON ONLY: "
            "[{'page': <page number>, 'search_query': '<permitting code query>', 'image_description': '<extremely thorough description of what the image contains, including any annotations and dimensions. enough information to recreate the exact image.>'}] "
            "NO MARKDOWN, NO COMMENTARY. ONLY JSON"
        )
        user_message = json.dumps([
            {"page": p, "image_b64": b64}
            for p, b64 in zip(page_list, b64_batch)
        ])

        batch = call_openrouter(system_prompt_query, MODEL_SEGMENT, user_message)
        for obj in batch:
            pg = obj.get("page")
            qry = obj.get("search_query")
            img = obj.get("image_description")
            if pg and qry and img:
                segments.append({
                    "page": pg, 
                    "query": qry, 
                    "image_description": img, 
                    "segment_text": text_batch[page_list.index(pg)] 
                })

    print(f"Generated {len(segments)} segments")
    return segments

# === Step 2: S3 traversal ===
def list_subfolders(prefix: str) -> list[str]:
    paginator = s3.get_paginator('list_objects_v2')
    pages = paginator.paginate(Bucket=BUCKET_NAME, Prefix=prefix, Delimiter='/')
    subfolders = []
    for page in pages:
        for cp in page.get('CommonPrefixes', []):
            path = cp.get('Prefix')
            if path:
                subfolders.append(path)
    return subfolders


def navigate_s3(queries: list[str]) -> list[str]:
    print("Navigating S3 bucket...")
    active_prefixes = ["jurisdiction/"]
    final_paths = []

    while active_prefixes:
        next_prefixes = []
        for prefix in active_prefixes:
            subfolders = list_subfolders(prefix)
            if not subfolders:
                final_paths.append(prefix)
                continue

            system_prompt = f"""
            You are navigating an S3 directory tree to find matches for the following queries:

            {chr(10).join(f"- {q}" for q in queries)}

            Current directory: {prefix}

            Immediate subfolders available:
            {chr(10).join(f"- {folder}" for folder in subfolders)}

            Instructions:
            - Select all subfolders that seem relevant to any of the queries. Pick a maximum of 5 subfolders.
            - You may select multiple subfolders, but you MUST pick at least one subfolder until you reach sections.
            - Only pick from the listed subfolders exactly.
            - Output STRICT JSON: a list of selected subfolder paths, no explanations, no markdown.

            Example output:

            [
            "jurisdiction/county/city/la/titles/plumbing/",
            "jurisdiction/county/city/la/titles/fire/"
            ]
            """.strip()

            selected = call_openrouter(system_prompt, MODEL_SEGMENT, "Pick subfolders.")
            if selected:
                next_prefixes.extend(selected)
            else:
                print(f"⚠️ Skipped branch {prefix} due to invalid output.")

        active_prefixes = next_prefixes

    print(f"✅ Finished S3 traversal. {len(final_paths)} final paths selected.")
    return final_paths


# === Step 3: Fetch context ===
def fetch_context(paths: list[str]) -> list[dict]:
    items = []
    for p in paths:
        contents = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=p).get('Contents', [])
        for entry in contents:
            key = entry.get('Key')
            if key and key.endswith('.json'):
                body = s3.get_object(Bucket=BUCKET_NAME, Key=key)['Body'].read()
                doc = json.loads(body)
                text = doc.get('text')
                sec = doc.get('section_number')
                if text and sec:
                    items.append({'citation': f"Section {sec}", 'text': text.strip()})
    print(f"Fetched {len(items)} context items")
    return items

# === Step 4: Compliance checks ===
def run_compliance(segments: list[dict], context: list[dict]) -> list[dict]:
    violations = []
    for seg in segments:
        ctx = '\n'.join(f"[{c['citation']}] {c['text']}" for c in context)
        prompt = (
            f"""
            You are a building code compliance checker.

            Building Code Context:
            {ctx}

            Project:
            - Page: {seg['page']}
            - Query: {seg['query']}
            - Image Description: {seg['image_description']}
            - Segment Text: {seg['segment_text']}

            Analyze carefully based on image description and segment text. Output JSON list of violations only.
            ONLY ADD VIOLATION IF THERE IS AN ANALYSIS AND HIGH CHANCE OF A CODE VIOLATION. Do not simply restate the codes. 
            Format:
            [
            {{ "page": <page>, "violation": {{ "citation": "Section XYZ", "quote": "Exact text", "reason": "Short explanation of how code is violated" }} }},
            ...
            ]
            NO MARKDOWN, NO COMMENTARY. ONLY JSON
            """.strip()
        )
        result = call_openrouter(prompt, MODEL_COMPLIANCE)
        violations.extend(result or [])
    print(f"Found {len(violations)} violations")
    return violations

# === Step 5: Compliance scoring ===
def compliance_score(violations: list[dict], total_pages: int) -> dict:
    prompt = (
        f"Total pages: {total_pages}\nViolations: {json.dumps(violations)}\n"
        f"Output JSON: {{ 'compliance_score': 0-100 }}"
        f"Give a reasonable score based on number of violations and severity. The scores typically range from 70-90."
        f"NO MARKDOWN, NO COMMENTARY. ONLY JSON"
    )
    score = call_openrouter(prompt, MODEL_COMPLIANCE)
    print(f"Compliance score: {score}")
    return score

# === FastAPI app ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return JSONResponse({"status": "ok"})

@app.post("/api/claude")
async def analyse_permit(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Must upload a PDF file.")
    tmp = "/tmp/upload.pdf"
    contents = await file.read()
    with open(tmp, 'wb') as f:
        f.write(contents)

    try:
        segments      = generate_segments(tmp)
        queries       = [s['query'] for s in segments]
        paths         = navigate_s3(queries)
        context_items = fetch_context(paths)
        violations    = run_compliance(segments, context_items)
        score_obj     = compliance_score(violations, total_pages=len(segments))
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Server error: {e}")

    return JSONResponse({
        'compliance_score': score_obj.get('compliance_score', 0),
        'violations': violations
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True, timeout_keep_alive=120)
