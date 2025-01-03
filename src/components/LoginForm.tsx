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
import './LoginForm.css'; // Make sure to create this CSS file

const LoginForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isRecaptchaReady, setRecaptchaReady] = useState<boolean>(false);
  const history = useHistory();

  const initializeRecaptcha = () => {
    if (!isRecaptchaReady) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth,
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
    <IonCard className="login-card">
      <IonCardHeader>
        <IonCardTitle className="login-title">Login</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <div className="input-container">
          <IonLabel position="stacked" className="phone-label">
            Phone Number
          </IonLabel>
          <IonItem lines="none" className="phone-input-item">
            <IonInput
              type="tel"
              maxlength={10}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onIonChange={(e) => setPhoneNumber(e.detail.value!)}
              className="phone-input"
            />
          </IonItem>
        </div>

        <div id="recaptcha-container"></div>

        <IonButton 
          expand="block" 
          color="primary" 
          onClick={handleSendOTP}
          className="send-otp-button"
        >
          Send OTP
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LoginForm;
