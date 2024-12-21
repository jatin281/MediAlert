import { useState } from "react";
import { useHistory } from "react-router-dom";

const useOnboarding = () => {
  const [name, setName] = useState<string>(""); // State for name
  const history = useHistory(); // Navigation hook

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter your name!"); // Simple validation
      return;
    }

    // Navigate to the next onboarding screen (adjust the route as needed)
    history.push("/gender-dob");
  };

  return { name, handleNameChange, handleNext };
};

export default useOnboarding;
