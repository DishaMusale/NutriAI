import { useState } from "react";

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

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome {profile?.name} 👋</h1>

      <h2>Your Profile</h2>

      <p><strong>Goal:</strong> {profile?.goal}</p>

      <p><strong>Diet:</strong> {profile?.dietType}</p>

      <p><strong>Budget:</strong> {profile?.budget}</p>

      <p><strong>Activity Level:</strong> {profile?.activityLevel}</p>

      <p><strong>Protein Priority:</strong> {profile?.proteinPriority}</p>

      <button onClick={generatePlan}>
        Generate Diet Plan
      </button>

      {loading && (
        <p>Generating AI Meal Plan...</p>
      )}

      {mealPlan && (
        <div>
          <h2>Your Personalized Meal Plan</h2>

          <pre>
            {mealPlan}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Dashboard;