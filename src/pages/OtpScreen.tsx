// OTPScreen.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const OTPScreen: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const history = useHistory();

  const handleVerifyOTP = () => {
    if (otp.length === 4) {
      // Implement OTP verification logic here
      console.log(`Verifying OTP: ${otp}`);
      alert('OTP verified successfully!');
      history.push('/home');
    } else {
      alert('Please enter a valid 4-digit OTP');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>OTP Verification</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Verify OTP</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <IonItem>
                    <IonLabel position="floating">OTP</IonLabel>
                    <IonInput
                      type="tel"
                      maxlength={4}
                      placeholder="Enter the OTP"
                      value={otp}
                      onIonChange={(e) => setOtp(e.detail.value!)}
                    />
                  </IonItem>

                  <IonButton expand="block" color="primary" onClick={handleVerifyOTP}>
                    Verify
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default OTPScreen;
