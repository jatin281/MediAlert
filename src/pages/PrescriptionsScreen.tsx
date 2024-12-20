import React, { useState } from 'react';
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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { base64ToBlob } from '../utils/base64ToBlob'; // Import the utility function
import { PDFDocument } from 'pdf-lib';

const PrescriptionsScreen: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<string[]>([]);

  
  // Utility function to convert array buffer to base64
const bufferToBase64 = (buffer: ArrayBuffer): string => {
    const byteArray = new Uint8Array(buffer);
    let binary = '';
    byteArray.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary); // Use window.btoa() for base64 encoding
  };

  // Function to handle uploading prescription
  const handleUploadPrescription = async (source: CameraSource) => {
    try {
      // Capture the photo
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source,
      });
  
      // Log the photo data for debugging
      console.log('Captured photo:', photo);
  
      if (photo.webPath) {
        // Fetch the image data from webPath (this could fail in some environments)
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
  
        console.log('Image Blob:', blob); // Log the blob to see if it's correctly fetched
  
        // Create a PDF document
        const pdfDoc = await PDFDocument.create();
        const imageBytes = await blob.arrayBuffer();
        
        let image;
        if (photo.format === 'png') {
          image = await pdfDoc.embedPng(imageBytes); // Embed PNG image
        } else {
          image = await pdfDoc.embedJpg(imageBytes); // Embed JPEG image (fallback)
        }
  
        // Add the image to the PDF page
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0 });
  
        // Save the PDF bytes
        const pdfBytes = await pdfDoc.save();
        
        // Convert to base64
        const base64data = bufferToBase64(pdfBytes);
        console.log('Generated Base64 PDF:', base64data);
  
        // Save the PDF to the filesystem
        const fileName = `prescription_${Date.now()}.pdf`;
        await Filesystem.writeFile({
          path: fileName,
          data: base64data,
          directory: Directory.Documents,
        });
  
        // Update state with the new file
        setPrescriptions((prev) => [...prev, fileName]);
        alert('Prescription uploaded successfully as a PDF!');
      }
    } catch (error) {
      console.error('Error uploading prescription:', error);
      alert('Failed to upload prescription. Please try again.');
    }
  };
  

  // Function to open the PDF
  const openPrescription = async (fileName: string) => {
    try {
      const filePath = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Documents,
      });
  
      if (Capacitor.isNativePlatform()) {
        // Open with native viewer
        await FileOpener.open({
          filePath: filePath.uri,
          contentType: 'application/pdf',
        });
      } else {
        // Fallback: Open in browser
        const fileData = await Filesystem.readFile({
          path: fileName,
          directory: Directory.Documents,
        });
  
        console.log('File data:', fileData);
        
        const base64Content = fileData.data;
  
        if (!base64Content) {
          throw new Error('No file data found.');
        }
  
        // Ensure base64Content is a string
        if (typeof base64Content === 'string') {
          // Convert the file data to Blob using base64ToBlob
          const blob = base64ToBlob(base64Content, 'application/pdf');
  
          // Open the PDF in the browser
          const url = URL.createObjectURL(blob);
          await Browser.open({ url });
        } else {
          throw new Error('Invalid file format. Expected base64 encoded string.');
        }
      }
    } catch (error) {
      console.error('Error opening prescription:', error);
      alert('Failed to open prescription. Please try again.');
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
              prescriptions.map((fileName, index) => (
                <IonItem
                  key={index}
                  button
                  onClick={() => openPrescription(fileName)}
                >
                  <IonLabel>{fileName}</IonLabel>
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
