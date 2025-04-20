import requests
import base64
import json

# === Config ===
image_path = "uploads/bathroom-compliant.jpg"  # Your image
api_key = "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"  # Replace with your OpenRouter key

# === Encode image to base64 ===
with open(image_path, "rb") as image_file:
    base64_image = base64.b64encode(image_file.read()).decode("utf-8")

# === Send to GPT-4 Vision via OpenRouter ===
response = requests.post(
    "https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    json={
        "model": "anthropic/claude-3-opus",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Please evaluate this construction figure and identify if it is within ADA compliance."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ],
            }
        ],
        "max_tokens": 1000,
        "temperature": 0.5
    }
)

# === Parse and print ===
data = response.json()

print("🔍 Full response:")
print(json.dumps(data, indent=2))  # <-- Add this


print("🧠 GPT-4 Vision Response:\n")
print(data["choices"][0]["message"]["content"])

