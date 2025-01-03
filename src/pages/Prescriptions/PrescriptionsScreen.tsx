import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useLocation } from 'react-router-dom'; // Import to get query params
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Browser } from '@capacitor/browser';
import { PDFDocument } from 'pdf-lib';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig'; // Import your Firebase config

const PrescriptionsScreen: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId'); // Get userId from the URL query parameters

  const [prescriptions, setPrescriptions] = useState<{ id: string; name: string; url: string }[]>([]);

  // Fetch prescriptions from Firestore
  const fetchPrescriptions = async () => {
    if (!userId) return;

    try {
      const prescriptionsRef = collection(db, 'users', userId, 'prescriptions');
      const snapshot = await getDocs(prescriptionsRef);

      const prescriptionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; name: string; url: string }[];

      setPrescriptions(prescriptionsData);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [userId]);

  // Handle uploading prescription
  const handleUploadPrescription = async (source: CameraSource) => {
    if (!userId) {
      alert('User ID not found. Cannot upload prescription.');
      return;
    }

    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source,
      });

      if (photo.webPath) {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();

        const pdfDoc = await PDFDocument.create();
        const imageBytes = await blob.arrayBuffer();

        const image =
          photo.format === 'png'
            ? await pdfDoc.embedPng(imageBytes)
            : await pdfDoc.embedJpg(imageBytes);

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0 });

        const pdfBytes = await pdfDoc.save();
        const fileName = `prescription_${Date.now()}.pdf`;

        // Upload to Firebase Storage
        const storageRef = ref(storage, `users/${userId}/prescriptions/${fileName}`);
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        await uploadBytes(storageRef, pdfBlob);
        const downloadURL = await getDownloadURL(storageRef);

        // Add metadata to Firestore
        const prescriptionsRef = collection(db, 'users', userId, 'prescriptions');
        const docRef = await addDoc(prescriptionsRef, {
          name: fileName,
          url: downloadURL,
          createdAt: new Date().toISOString(),
        });

        // Update local state
        setPrescriptions(prev => [...prev, { id: docRef.id, name: fileName, url: downloadURL }]);

        alert('Prescription uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading prescription:', error);
      alert('Failed to upload prescription. Please try again.');
    }
  };

  // Open prescription
  const openPrescription = async (url: string) => {
    try {
      await Browser.open({ url });
    } catch (error) {
      console.error('Error opening prescription:', error);
      alert('Failed to open prescription.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Prescriptions</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Upload Options */}
        <IonButton
          expand="block"
          color="primary"
          onClick={() => handleUploadPrescription(CameraSource.Camera)}
        >
          Upload from Camera
        </IonButton>
        <IonButton
          expand="block"
          color="secondary"
          onClick={() => handleUploadPrescription(CameraSource.Photos)}
        >
          Upload from Gallery
        </IonButton>

        {/* List of Prescriptions */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Uploaded Prescriptions</IonCardTitle>
          </IonCardHeader>
          <IonList>
            {prescriptions.length > 0 ? (
              prescriptions.map(prescription => (
                <IonItem
                  key={prescription.id}
                  button
                  onClick={() => openPrescription(prescription.url)}
                >
                  <IonLabel>{prescription.name}</IonLabel>
                </IonItem>
              ))
            ) : (
              <IonItem>
                <IonLabel>No prescriptions uploaded yet.</IonLabel>
              </IonItem>
            )}
          </IonList>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PrescriptionsScreen;
