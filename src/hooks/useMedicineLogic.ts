import { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig'; // Add storage import
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Medicine } from '../types/medicine';

export const useMedicineLogic = (userId: string) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch medicines from Firestore
  const fetchMedicines = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const medicinesRef = collection(db, 'users', userId, 'medicines');
      const snapshot = await getDocs(medicinesRef);
      const medicineData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medicine[];
      
      setMedicines(medicineData);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [userId]);

  // Helper function to compress image
  const compressImage = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.7 quality
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = dataUrl;
    });
  };

  // Add a new medicine to Firestore
  const addMedicine = async (newMedicine: Omit<Medicine, 'id'>): Promise<boolean> => {
    if (!userId) return false;

    try {
      let imageUrl = '';
      
      // Handle image upload if present
      if (newMedicine.image) {
        // Compress image
        const compressedImage = await compressImage(newMedicine.image);
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, `users/${userId}/medicines/${Date.now()}`);
        await uploadString(storageRef, compressedImage, 'data_url');
        imageUrl = await getDownloadURL(storageRef);
      }

      // Create medicine document without the data URL
      const medicineData = {
        ...newMedicine,
        image: imageUrl, // Replace data URL with storage URL
        createdAt: new Date().toISOString(),
      };

      // Add to Firestore
      const medicinesRef = collection(db, 'users', userId, 'medicines');
      const docRef = await addDoc(medicinesRef, medicineData);

      // Update local state
      const medicineWithId = {
        id: docRef.id,
        ...medicineData
      };
      
      setMedicines(prevMedicines => [...prevMedicines, medicineWithId]);
      return true;
    } catch (error) {
      console.error('Error adding medicine:', error);
      return false;
    }
  };

  return { 
    medicines, 
    addMedicine, 
    isLoading,
    refreshMedicines: fetchMedicines 
  };
};