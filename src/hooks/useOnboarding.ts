import { useState } from "react";
import { useHistory } from "react-router-dom";

// Define a type-safe interface for onboarding data
interface OnboardingDataType {
  name?: string;
  gender?: string;
  dateOfBirth?: string;
}

// Create a type-safe temporary storage
export const onboardingData: OnboardingDataType = {};

const useOnboarding = () => {
  const [name, setName] = useState<string>("");
  const history = useHistory();

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }

    onboardingData.name = name.trim();
    history.push("/gender-dob");
  };

  return { name, handleNameChange, handleNext };
};

export default useOnboarding;