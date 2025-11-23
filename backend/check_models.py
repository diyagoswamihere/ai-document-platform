import google.generativeai as genai
from app.config import get_settings

settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)

print("Available Gemini models:")
for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"  - {model.name}")