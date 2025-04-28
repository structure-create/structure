# server.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from temp import mock_analysis
from pydantic import BaseModel

app = FastAPI()

# Allow CORS (important when your frontend is separate)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production restrict origins!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    text: str

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    result = mock_analysis(contents)
    return result

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
