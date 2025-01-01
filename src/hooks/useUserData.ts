import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface UserData {
  id: string;  // Added ID to the interface
  name: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  email: string | null;
  image: string | null;
}

const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;

        if (!userId) {
          throw new Error('No authenticated user found');
        }

        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (userDoc.exists()) {
          setUserData({
            id: userId,  // Include the ID in the userData
            ...userDoc.data() as Omit<UserData, 'id'>
          });
        } else {
          throw new Error('User document not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
};

export default useUserData;