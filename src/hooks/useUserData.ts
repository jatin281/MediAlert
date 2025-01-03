import { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

interface UserData {
  id: string;
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

  const fetchUserData = useCallback(async () => {
    setLoading(true);
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
          id: userId,
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
  }, []);

  const updateUserData = async (updatedData: Partial<UserData>) => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        throw new Error('No authenticated user found');
      }

      const db = getFirestore();
      await updateDoc(doc(db, 'users', userId), updatedData);

      // Refresh local data
      setUserData((prevData) => ({
        ...prevData!,
        ...updatedData,
      }));
    } catch (err) {
      console.error('Error updating user data:', err);
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { userData, loading, error, refreshUserData: fetchUserData, updateUserData };
};

export default useUserData;