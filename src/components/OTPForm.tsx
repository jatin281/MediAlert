// src/components/OTPForm.tsx
import React, { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonSpinner,
  IonText
} from '@ionic/react';
import useAuth from '../hooks/useAuth';

const OTPForm: React.FC = () => {
  const [otp, setOTP] = useState<string>('');
  const { verifyOTP, loading, error } = useAuth();

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      verifyOTP(otp);
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Enter Verification Code</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <IonInput
          type="number"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onIonChange={e => setOTP(e.detail.value!)}
          maxlength={6}
          className="ion-margin-bottom"
        />

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <IonButton 
          expand="block" 
          onClick={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? <IonSpinner name="crescent" /> : 'Verify OTP'}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default OTPForm;