import "./LandingPage.css";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton
} from "@clerk/clerk-react";

function LandingPage({ onStart }) {
  return (
    <div className="landing-container">

      <div className="hero">

        <div className="logo">🌿</div>

        <h1>NutriAI</h1>

        <h2>AI Powered Smart Nutrition Planner</h2>

        <p>
          Create personalized meal plans based on your
          goals, diet preferences, activity level and budget.
        </p>

        <SignedIn>
  <Link to="/questionnaire">
    <button className="start-btn">
      Start Questionnaire →
    </button>
  </Link>
</SignedIn>

<SignedOut>
  <SignInButton mode="modal">
    <button className="start-btn">
      Sign In to Get Started →
    </button>
  </SignInButton>
</SignedOut>

        <div className="features">

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Generated</h3>
            <p>Smart meal recommendations</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3>Personalized</h3>
            <p>Tailored to your preferences</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Budget Friendly</h3>
            <p>Affordable meal suggestions</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Goal Focused</h3>
            <p>Weight loss, gain or maintenance</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default LandingPage;