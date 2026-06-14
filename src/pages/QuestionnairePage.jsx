import Questionnaire from "../components/Questionnaire";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";

export default function QuestionnairePage() {
  return (
    <>
      <SignedIn>
        <Questionnaire />
      </SignedIn>

      <SignedOut>
        <SignIn />
      </SignedOut>
    </>
  );
}