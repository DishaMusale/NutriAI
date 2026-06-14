import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import QuestionnairePage from "./pages/QuestionnairePage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
  path="/"
  element={
    <div>

      <SignedOut>
        <LandingPage />

        <div
          style={{
            textAlign: "center",
            marginTop: "-100px",
          }}
        >
          <SignInButton />
          <SignUpButton />
        </div>
      </SignedOut>

      <SignedIn>
        <div
    style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 1000
    }}
  >
    <UserButton />
  </div>
  
        <LandingPage />

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