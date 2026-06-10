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
    allergies: list[str] = []

@app.post("/generate-plan")
def generate_plan(profile: UserProfile):

    prompt = f"""
    Generate a personalized 7-day Indian meal plan.

    Name: {profile.name}
    Goal: {profile.goal}
    Diet Type: {profile.dietType}
    Budget: {profile.budget}
    Allergies: {profile.allergies}

    Include:
    - Breakfast
    - Lunch
    - Dinner
    - Estimated Calories

    Make the plan practical and affordable.
    """

    model = genai.GenerativeModel(
        "models/gemini-2.5-flash"
    )

    response = model.generate_content(prompt)

    return {
        "meal_plan": response.text
    }