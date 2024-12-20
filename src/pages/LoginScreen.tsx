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
  IonCardContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const history = useHistory();

  const handleSendOTP = () => {
    if (phoneNumber.length === 10) {
      console.log('Sending OTP to:', phoneNumber);
      // Add your OTP logic here, e.g., call an API to send OTP
      // fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ phoneNumber }) });

      alert(`OTP sent to ${phoneNumber}`);
      // Navigate to OTP screen
      history.push('/otp');
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Login</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <IonItem>
                    <IonLabel position="floating">Phone Number</IonLabel>
                    <IonInput
                      type="tel"
                      maxlength={10}
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onIonChange={(e) => setPhoneNumber(e.detail.value!)}
                    />
                  </IonItem>

                  <IonButton expand="block" color="primary" onClick={handleSendOTP}>
                    Send OTP
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

export default LoginScreen;
