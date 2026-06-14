import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./Dashboard.css";

function Dashboard() {

  const profile = JSON.parse(
    localStorage.getItem("userprofile")
  );

  const [mealPlan, setMealPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {

  try {

    setLoading(true);

    const response = await fetch(
      "http://127.0.0.1:8000/generate-plan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      }
    );

    const data = await response.json();

    setMealPlan(data.meal_plan);

    try {

      await addDoc(
        collection(db, "mealPlans"),
        {
          userName: profile?.name || "Unknown",
          goal: profile?.goal || "",
          dietType: profile?.dietType || "",
          budget: profile?.budget || "",
          activityLevel: profile?.activityLevel || "",
          mealPlan: data.meal_plan,
          createdAt: new Date(),
        }
      );

      console.log("Meal plan saved successfully!");

    } catch (firestoreError) {

      console.error(
        "Firestore save failed:",
        firestoreError
      );

    }

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
};

const parseMealPlan = (text) => {
  if (!text) return [];

  const matches = text.match(
    /=== DAY \d+ ===[\s\S]*?(?=(=== DAY \d+ ===|$))/g
  );

  return matches || [];
};

const parsedDays = parseMealPlan(mealPlan);
console.log(parsedDays[0]);

return (
  <div className="dashboard-container">

    <div className="dashboard-content">

      <div className="welcome-section">
        <h1>Welcome {profile?.name} </h1>
        <p>
          Let's create a personalized nutrition plan for you.
        </p>
      </div>

      <div className="profile-grid">

        <div className="profile-card">
          <h3>Goal</h3>
          <p>{profile?.goal}</p>
        </div>

        <div className="profile-card">
          <h3>Diet Type</h3>
          <p>{profile?.dietType}</p>
        </div>

        <div className="profile-card">
          <h3>Budget</h3>
          <p>{profile?.budget}</p>
        </div>

        <div className="profile-card">
          <h3>Activity Level</h3>
          <p>{profile?.activityLevel}</p>
        </div>

      </div>

      <button
        className="generate-btn"
        onClick={generatePlan}
      >
        Generate AI Meal Plan
      </button>

      {loading && (
        <div className="loading-box">
          Creating your personalized meal plan...
        </div>
      )}

      {mealPlan && (
  <div className="meal-section">

    <h2>Your Personalized 7-Day Meal Plan</h2>

    {parsedDays.map((day, index) => {
      const lines = day.split("\n").filter((line) => line.trim());

      return (
        <div className="day-card" key={index}>
          <h3>Day {index + 1}</h3>

          {lines
  .filter(line => !line.includes("=== DAY"))
  .map((line, i) => (
    <p key={i}>{line}</p>
))}
        </div>
      );
    })}

  </div>
)}

    </div>
  </div>
);
}

export default Dashboard;