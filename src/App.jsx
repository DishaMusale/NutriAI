import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import QuestionnairePage from "./pages/QuestionnairePage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <div style={{ padding: "40px" }}>
              <h1>NutriAI</h1>

              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>

              <SignedIn>
                <UserButton />
                <br />
                <br />
                <a href="/questionnaire">
                  Start Questionnaire
                </a>
              </SignedIn>
            </div>
          }
        />

        <Route
          path="/questionnaire"
          element={<QuestionnairePage />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;