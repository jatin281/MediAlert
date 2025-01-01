import { useState } from "react";
import { useHistory } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { onboardingData } from './useOnboarding';

interface UserData {
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  email: string | null;
  image: string | null;
}

const useOnboardingGenderDOB = () => {
  const [gender, setGender] = useState<string>("");
  const [dob, setDOB] = useState<string>("");
  const history = useHistory();
  const auth = getAuth();
  const db = getFirestore();

  const handleGenderChange = (value: string) => {
    setGender(value);
  };

  const handleDOBChange = (value: string) => {
    setDOB(value);
  };

  const handleNext = async () => {
    if (!gender || !dob) {
      alert("Please complete all fields!");
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      const phoneNumber = auth.currentUser?.phoneNumber;

      if (!userId || !phoneNumber || !onboardingData.name) {
        throw new Error('Missing required user information');
      }

      const userData: UserData = {
        name: onboardingData.name,
        phoneNumber: phoneNumber,
        dateOfBirth: dob,
        gender: gender,
        email: null,
        image: null
      };

      await setDoc(doc(db, 'users', userId), userData);

      // Type-safe way to clear onboarding data
      onboardingData.name = undefined;
      onboardingData.gender = undefined;
      onboardingData.dateOfBirth = undefined;

      history.push("/home");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to complete registration. Please try again.");
    }
  };

  const handleSkip = () => {
    alert("Please complete all fields to continue.");
  };

  return { gender, dob, handleGenderChange, handleDOBChange, handleNext, handleSkip };
};

export default useOnboardingGenderDOB;