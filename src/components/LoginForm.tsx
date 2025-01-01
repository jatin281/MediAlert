import React, { useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  Auth 
} from 'firebase/auth';
import { auth } from "../firebaseConfig";

const LoginForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isRecaptchaReady, setRecaptchaReady] = useState<boolean>(false);
  const history = useHistory();

  const initializeRecaptcha = () => {
    if (!isRecaptchaReady) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, // Move auth to first parameter
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("Recaptcha verified");
          },
        }
      );
      setRecaptchaReady(true);
    }
  };

  const handleSendOTP = () => {
    if (phoneNumber.length === 10) {
      initializeRecaptcha();
      const appVerifier = window.recaptchaVerifier;
  
      signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          alert(`OTP sent to ${phoneNumber}`);
          history.push("/otp");
        })
        .catch((error) => {
          console.error("Error sending OTP:", error);
          alert("Failed to send OTP. Please try again.");
        });
    } else {
      alert("Please enter a valid 10-digit phone number");
    }
  };

  return (
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

        <div id="recaptcha-container"></div>

        <IonButton expand="block" color="primary" onClick={handleSendOTP}>
          Send OTP
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LoginForm;