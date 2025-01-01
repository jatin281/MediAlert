import React from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonProgressBar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import "./OnboardingGenderDOB.css";
import useOnboardingGenderDOB from "../../hooks/useOnboardingGenderDOB";

const OnboardingGenderDOB: React.FC = () => {
  const { gender, dob, handleGenderChange, handleDOBChange, handleNext, handleSkip } =
    useOnboardingGenderDOB();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding onboarding-container">
        {/* Progress Bar */}
        <IonProgressBar value={0.66}></IonProgressBar>

        {/* Heading */}
        <IonGrid>
          <IonRow>
            <IonCol>
              <h2 className="onboarding-heading">Tell us about yourself</h2>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Gender Selector */}
        <IonItem lines="none" className="onboarding-input-container">
          <IonLabel position="stacked">Your gender</IonLabel>
          <IonSelect
            placeholder="Select an option"
            value={gender}
            onIonChange={(e) => handleGenderChange(e.detail.value!)}
          >
            <IonSelectOption value="male">Male</IonSelectOption>
            <IonSelectOption value="female">Female</IonSelectOption>
            <IonSelectOption value="other">Other</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* DOB Input */}
        <IonItem lines="none" className="onboarding-input-container">
          <IonLabel position="stacked">Your birthday</IonLabel>
          <IonInput
            placeholder="dd / mm / yyyy"
            value={dob}
            onIonChange={(e) => handleDOBChange(e.detail.value!)}
            clearInput
          ></IonInput>
        </IonItem>

        {/* Next Button */}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton
                expand="block"
                className="onboarding-next-button"
                onClick={handleNext}
              >
                Done
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default OnboardingGenderDOB;
