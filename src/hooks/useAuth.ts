// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  getAuth, 
  PhoneAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const useAuth = () => {
  const history = useHistory();
  const auth = getAuth();
  const db = getFirestore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
      setInitialAuthCheckDone(true);

      if (user) {
        // Check if user has completed onboarding
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          history.push('/onboarding-name');
        }
      }
    });

    return () => unsubscribe();
  }, [auth, history, db]);

  const checkExistingUser = async (userId: string): Promise<boolean> => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists();
  };

  const verifyOTP = async (otp: string) => {
    try {
      setLoading(true);
      setError(null);

      const confirmationResult = window.confirmationResult;
      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      
      const userId = userCredential.user.uid;
      const userExists = await checkExistingUser(userId);

      if (userExists) {
        history.push('/home');
      } else {
        history.push('/onboarding-name');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('OTP Verification Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      history.push('/login');
    } catch (err) {
      console.error('Logout Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during logout');
    }
  };

  return { 
    verifyOTP, 
    handleLogout, 
    loading, 
    error, 
    isAuthenticated,
    initialAuthCheckDone 
  };
};

export default useAuth;