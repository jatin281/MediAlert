import { useState } from "react";
import { useHistory } from "react-router-dom";

const useOnboardingGenderDOB = () => {
  const [gender, setGender] = useState<string>("");
  const [dob, setDOB] = useState<string>(""); // Use date format validation if necessary
  const history = useHistory();

  const handleGenderChange = (value: string) => {
    setGender(value);
  };

  const handleDOBChange = (value: string) => {
    setDOB(value);
  };

  const handleNext = () => {
    if (!gender || !dob) {
      alert("Please complete all fields!"); // Simple validation
      return;
    }

    // Proceed to the next screen (adjust route as needed)
    history.push("/onboarding-step-3");
  };

  const handleSkip = () => {
    // Skip this step and proceed to the next screen
    history.push("/onboarding-step-3");
  };

  return { gender, dob, handleGenderChange, handleDOBChange, handleNext, handleSkip };
};

export default useOnboardingGenderDOB;
