import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonModal,
  IonDatetime,
  IonToast,
  IonNote,
  IonToggle
} from '@ionic/react';
import { notifications } from 'ionicons/icons';
import { Medicine } from '../../types/medicine';
import { useAlerts } from '../../hooks/useAlerts';

// Static medicines data for testing
const STATIC_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Aspirin',
    dosage: '500mg',
    frequency: 'Twice a day',
    details: 'Take with food',
    quantity: 30
  },
  {
    id: '2',
    name: 'Vitamin D',
    dosage: '1000 IU',
    frequency: 'Once a day',
    details: 'Take in the morning',
    quantity: 60
  },
  {
    id: '3',
    name: 'Antibiotic',
    dosage: '250mg',
    frequency: 'Three times a day',
    details: 'Take until completed',
    quantity: 21
  }
];

const AlertScreen: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const { alerts, setAlert, toggleAlert, calculateAlertTimes } = useAlerts(STATIC_MEDICINES);

  const handleSetAlert = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
  };

  const handleSaveAlert = async () => {
    if (!selectedMedicine || !selectedTime) return;

    await setAlert(selectedMedicine, selectedTime);
    setShowModal(false);
    setShowToast(true);
    setSelectedMedicine(null);
    setSelectedTime('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Medicine Alerts</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {STATIC_MEDICINES.map(medicine => {
            const alert = alerts.find(a => a.medicineId === medicine.id);
            
            return (
              <IonItem key={medicine.id}>
                <IonLabel>
                  <h2>{medicine.name}</h2>
                  <p>Dosage: {medicine.dosage}</p>
                  <p>Frequency: {medicine.frequency}</p>
                  {alert && (
                    <IonNote>
                      Alert times: {alert.times.join(', ')}
                    </IonNote>
                  )}
                </IonLabel>
                {alert ? (
                  <IonToggle
                    slot="end"
                    checked={alert.isEnabled}
                    onIonChange={() => toggleAlert(medicine.id)}
                  />
                ) : (
                  <IonButton
                    slot="end"
                    fill="clear"
                    onClick={() => handleSetAlert(medicine)}
                  >
                    <IonIcon slot="start" icon={notifications} />
                    Set Alert
                  </IonButton>
                )}
              </IonItem>
            );
          })}
        </IonList>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Set Alert Time</IonTitle>
              <IonButton slot="end" onClick={() => setShowModal(false)}>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel>Select First Alert Time</IonLabel>
              <IonDatetime
                presentation="time"
                value={selectedTime}
                onIonChange={e => {
                    // Ensure we're getting a string value
                    const timeValue = typeof e.detail.value === 'string' 
                    ? e.detail.value 
                    : (e.detail.value as string[])[0];
                    setSelectedTime(timeValue || '');
                }}
                />
            </IonItem>
            {selectedTime && selectedMedicine && (
              <div className="ion-padding">
                <p>Based on the frequency ({selectedMedicine.frequency}), alerts will be set for:</p>
                <ul>
                  {calculateAlertTimes(selectedTime, selectedMedicine.frequency).map((time, index) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
              </div>
            )}
            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={handleSaveAlert}
              disabled={!selectedTime}
            >
              Save Alert
            </IonButton>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          message="Alert set successfully!"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default AlertScreen;