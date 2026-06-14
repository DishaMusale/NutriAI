from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserProfile(BaseModel):
    name: str
    goal: str
    dietType: str
    budget: str
    activityLevel: str
    proteinPriority: str
    allergies: list[str] = []

@app.post("/generate-plan")
def generate_plan(profile: UserProfile):

    prompt = f"""
Create a personalized 7-day Indian meal plan.

User Details:
Name: {profile.name}
Goal: {profile.goal}
Diet Type: {profile.dietType}
Budget: {profile.budget}
Activity Level: {profile.activityLevel}
Protein Priority: {profile.proteinPriority}

IMPORTANT:

Return ONLY in this format:

=== DAY 1 ===
Breakfast: ...
Lunch: ...
Dinner: ...
Snack: ...

=== DAY 2 ===
Breakfast: ...
Lunch: ...
Dinner: ...
Snack: ...

Continue until DAY 7.

Rules:
- No introduction
- No conclusion
- No markdown
- No bullet points
- No explanations
- Only meal plans
- Use affordable Indian foods
- Keep meals practical
- Respect diet type
- Match the user's goal
"""

    model = genai.GenerativeModel(
        "models/gemini-2.5-flash"
    )

    response = model.generate_content(prompt)

    return {
        "meal_plan": response.text
    }