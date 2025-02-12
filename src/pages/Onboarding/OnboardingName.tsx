import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonProgressBar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import "./OnboardingName.css";
import useOnboarding from "../../hooks/useOnboarding";

const OnboardingName: React.FC = () => {
  const { name, handleNameChange, handleNext } = useOnboarding();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding onboarding-container">
        {/* Progress Bar */}
        <IonProgressBar value={0.33}></IonProgressBar>

        {/* Heading */}
        <IonGrid>
          <IonRow>
            <IonCol>
              <h2 className="onboarding-heading">Tell us about yourself</h2>
              <p className="onboarding-subheading">Enter your Name</p>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Input Field */}
        <div className="input-spacing">
          <IonItem lines="none" className="onboarding-input-container">
            <IonLabel position="stacked">Full Name</IonLabel>
            <IonInput
              placeholder="Full Name"
              value={name}
              onIonChange={(e) => handleNameChange(e.detail.value!)}
              clearInput
            ></IonInput>
          </IonItem>
        </div>

        {/* Next Button */}
        <IonButton
          expand="block"
          className="onboarding-next-button"
          onClick={handleNext}
        >
          Next
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default OnboardingName;