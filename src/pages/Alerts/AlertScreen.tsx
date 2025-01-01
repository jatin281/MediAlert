// import React, { useState, useEffect } from 'react';
// import {
//   IonPage,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonList,
//   IonItem,
//   IonLabel,
//   IonButton,
//   IonIcon,
//   IonModal,
//   IonDatetime,
//   IonToast,
//   IonNote,
//   IonToggle,
//   IonSpinner,
// } from '@ionic/react';
// import { useLocation } from 'react-router-dom';
// import { notifications } from 'ionicons/icons';
// import { useAlerts } from '../../hooks/useAlerts';
// import { Medicine } from '../../types/medicine';
// import storage from '../../storage'; // Make sure this imports correctly

// const AlertScreen: React.FC = () => {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const userId = params.get('userId');

//   const { medicines, alerts, setAlert, toggleAlert, calculateAlertTimes, isLoading } = useAlerts(userId);
//   const [localAlerts, setLocalAlerts] = useState(alerts || []); // Local state for alerts
//   const [showModal, setShowModal] = useState(false);
//   const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
//   const [selectedTime, setSelectedTime] = useState('');
//   const [showToast, setShowToast] = useState(false);

//   // Load alerts from storage
//   const loadAlertsFromStorage = async () => {
//     const storedAlerts = await storage.get('alerts');
//     if (storedAlerts) {
//       setLocalAlerts(storedAlerts);
//     }
//   };

//   // Save alerts to storage
//   const saveAlertsToStorage = async (updatedAlerts: any) => {
//     await storage.set('alerts', updatedAlerts);
//   };

//   // Effect to sync alerts with storage
//   useEffect(() => {
//     loadAlertsFromStorage();
//   }, []);

//   useEffect(() => {
//     saveAlertsToStorage(localAlerts);
//   }, [localAlerts]);

//   const handleSetAlert = (medicine: Medicine) => {
//     setSelectedMedicine(medicine);
//     const existingAlert = localAlerts.find((a) => a.medicineId === medicine.id);
//     if (existingAlert) {
//       setSelectedTime(existingAlert.startTime);
//     }
//     setShowModal(true);
//   };

//   const handleSaveAlert = async () => {
//     if (!selectedMedicine || !selectedTime) return;

//     console.log("in handleSaveAlert:",selectedMedicine.id)
//     const newAlert = {
//       medicineId: selectedMedicine.id,
//       startTime: selectedTime,
//       times: calculateAlertTimes(selectedTime, selectedMedicine.frequency),
//       isEnabled: true,
//     };

//     const updatedAlerts = localAlerts.filter((alert) => alert.medicineId !== selectedMedicine.id);
//     updatedAlerts.push(newAlert);

//     setLocalAlerts(updatedAlerts);
//     setShowModal(false);
//     setShowToast(true);
//     setSelectedMedicine(null);
//     setSelectedTime('');
//   };

//   if (isLoading) {
//     return (
//       <IonPage>
//         <IonHeader>
//           <IonToolbar>
//             <IonTitle>Medicine Alerts</IonTitle>
//           </IonToolbar>
//         </IonHeader>
//         <IonContent className="ion-padding ion-text-center">
//           <IonSpinner name="crescent" />
//           <p>Loading alerts...</p>
//         </IonContent>
//       </IonPage>
//     );
//   }

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Medicine Alerts</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent className="ion-padding">
//         <IonList>
//           {medicines.length === 0 ? (
//             <IonItem>
//               <IonLabel className="ion-text-center">
//                 No medicines found. Add medicines to set alerts.
//               </IonLabel>
//             </IonItem>
//           ) : (
//             medicines.map((medicine) => {
//               const alert = localAlerts.find((a) => a.medicineId === medicine.id);

//               return (
//                 <IonItem key={medicine.id}>
//                   <IonLabel>
//                     <h2>{medicine.name}</h2>
//                     <p>Dosage: {medicine.dosage}</p>
//                     <p>Frequency: {medicine.frequency}</p>
//                     {alert && (
//                       <IonNote color={alert.isEnabled ? 'primary' : 'medium'}>
//                         Alert times: {alert.times.join(', ')}
//                         {!alert.isEnabled && ' (Disabled)'}
//                       </IonNote>
//                     )}
//                   </IonLabel>
//                   {alert ? (
//                     <div className="ion-padding-start" slot="end">
//                       <IonToggle
//                         checked={alert.isEnabled}
//                         onIonChange={() => {
//                           const updatedAlerts = localAlerts.map((a) =>
//                             a.medicineId === alert.medicineId
//                               ? { ...a, isEnabled: !a.isEnabled }
//                               : a
//                           );
//                           setLocalAlerts(updatedAlerts);
//                         }}
//                       />
//                       <IonButton
//                         fill="clear"
//                         size="small"
//                         onClick={() => handleSetAlert(medicine)}
//                       >
//                         Edit
//                       </IonButton>
//                     </div>
//                   ) : (
//                     <IonButton
//                       slot="end"
//                       fill="clear"
//                       onClick={() => handleSetAlert(medicine)}
//                     >
//                       <IonIcon slot="start" icon={notifications} />
//                       Set Alert
//                     </IonButton>
//                   )}
//                 </IonItem>
//               );
//             })
//           )}
//         </IonList>

//         <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
//           <IonHeader>
//             <IonToolbar>
//               <IonTitle>
//                 {selectedMedicine ? `Set Alert for ${selectedMedicine.name}` : 'Set Alert Time'}
//               </IonTitle>
//               <IonButton slot="end" onClick={() => setShowModal(false)}>
//                 Close
//               </IonButton>
//             </IonToolbar>
//           </IonHeader>
//           <IonContent className="ion-padding">
//             <IonItem>
//               <IonLabel position="stacked">Select First Alert Time</IonLabel>
//               <IonDatetime
//                 presentation="time"
//                 value={selectedTime}
//                 onIonChange={(e) => {
//                   const timeValue =
//                     typeof e.detail.value === 'string'
//                       ? e.detail.value
//                       : (e.detail.value as string[])[0];
//                   setSelectedTime(timeValue || '');
//                 }}
//               />
//             </IonItem>
//             {selectedTime && selectedMedicine && (
//               <div className="ion-padding">
//                 <p>
//                   Based on the frequency ({selectedMedicine.frequency}), alerts will be set for:
//                 </p>
//                 <ul>
//                   {calculateAlertTimes(selectedTime, selectedMedicine.frequency).map((time, index) => (
//                     <li key={index}>{time}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             <IonButton
//               expand="block"
//               className="ion-margin-top"
//               onClick={handleSaveAlert}
//               disabled={!selectedTime}
//             >
//               Save Alert
//             </IonButton>
//           </IonContent>
//         </IonModal>

//         <IonToast
//           isOpen={showToast}
//           message="Alert set successfully!"
//           duration={2000}
//           onDidDismiss={() => setShowToast(false)}
//         />
//       </IonContent>
//     </IonPage>
//   );
// };

// export default AlertScreen;


import React, { useState, useEffect } from 'react';
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
  IonToggle,
  IonSpinner,
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { notifications } from 'ionicons/icons';
import { useAlerts } from '../../hooks/useAlerts';
import { Medicine } from '../../types/medicine';
import storage from '../../storage';
import { LocalNotifications } from '@capacitor/local-notifications';

const AlertScreen: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');

  const { medicines, alerts, setAlert, toggleAlert, calculateAlertTimes, isLoading } = useAlerts(userId);
  const [localAlerts, setLocalAlerts] = useState(alerts || []);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Alert set successfully!');
  const [toastColor, setToastColor] = useState('success');

  useEffect(() => {
    const setupNotificationListeners = async () => {
      await LocalNotifications.addListener('localNotificationReceived', (notification) => {
        console.log('Received notification:', notification);
      });

      await LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        console.log('Notification action performed:', notification);
      });
    };

    setupNotificationListeners();
  }, []);

  // Load alerts from storage
  useEffect(() => {
    const loadAlertsFromStorage = async () => {
      const storedAlerts = await storage.get('alerts');
      if (storedAlerts) {
        setLocalAlerts(storedAlerts);
      }
    };

    loadAlertsFromStorage();
  }, []);

  // Save alerts to storage whenever they change
  useEffect(() => {
    const saveAlertsToStorage = async () => {
      await storage.set('alerts', localAlerts);
    };

    saveAlertsToStorage();
  }, [localAlerts]);

  const handleSetAlert = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    const existingAlert = localAlerts.find((a) => a.medicineId === medicine.id);
    if (existingAlert) {
      setSelectedTime(existingAlert.startTime);
    }
    setShowModal(true);
  };

  const handleSaveAlert = async () => {
    if (!selectedMedicine || !selectedTime) return;

    console.log(" inside handlesavealert:", selectedMedicine.id)

    try {
      const newAlert = {
        medicineId: selectedMedicine.id,
        startTime: selectedTime,
        times: calculateAlertTimes(selectedTime, selectedMedicine.frequency),
        isEnabled: true,
      };

      const updatedAlerts = localAlerts.filter((alert) => alert.medicineId !== selectedMedicine.id);
      updatedAlerts.push(newAlert);

      await setAlert(selectedMedicine, selectedTime);
      setLocalAlerts(updatedAlerts);
      setShowModal(false);
      setToastMessage('Alert set successfully!');
      setToastColor('success');
      setShowToast(true);
      setSelectedMedicine(null);
      setSelectedTime('');
    } catch (error) {
      console.error('Error saving alert:', error);
      setToastMessage('Failed to set alert. Please try again.');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const handleToggleAlert = async (medicineId: string, isEnabled: boolean) => {
    try {
      const updatedAlerts = localAlerts.map((a) =>
        a.medicineId === medicineId ? { ...a, isEnabled: !isEnabled } : a
      );
      setLocalAlerts(updatedAlerts);
      await toggleAlert(medicineId);
      setToastMessage(isEnabled ? 'Alert disabled' : 'Alert enabled');
      setToastColor('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error toggling alert:', error);
      setToastMessage('Failed to toggle alert. Please try again.');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Medicine Alerts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner name="crescent" />
          <p>Loading alerts...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Medicine Alerts</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {medicines.length === 0 ? (
            <IonItem>
              <IonLabel className="ion-text-center">
                No medicines found. Add medicines to set alerts.
              </IonLabel>
            </IonItem>
          ) : (
            medicines.map((medicine) => {
              const alert = localAlerts.find((a) => a.medicineId === medicine.id);

              return (
                <IonItem key={medicine.id}>
                  <IonLabel>
                    <h2>{medicine.name}</h2>
                    <p>Dosage: {medicine.dosage}</p>
                    <p>Frequency: {medicine.frequency}</p>
                    {alert && (
                      <IonNote color={alert.isEnabled ? 'primary' : 'medium'}>
                        Alert times: {alert.times.join(', ')}
                        {!alert.isEnabled && ' (Disabled)'}
                      </IonNote>
                    )}
                  </IonLabel>
                  {alert ? (
                    <div className="ion-padding-start" slot="end">
                      <IonToggle
                        checked={alert.isEnabled}
                        onIonChange={() => handleToggleAlert(alert.medicineId, alert.isEnabled)}
                      />
                      <IonButton
                        fill="clear"
                        size="small"
                        onClick={() => handleSetAlert(medicine)}
                      >
                        Edit
                      </IonButton>
                    </div>
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
            })
          )}
        </IonList>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {selectedMedicine ? `Set Alert for ${selectedMedicine.name}` : 'Set Alert Time'}
              </IonTitle>
              <IonButton slot="end" onClick={() => setShowModal(false)}>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Select First Alert Time</IonLabel>
              <IonDatetime
                presentation="time"
                value={selectedTime}
                onIonChange={(e) => {
                  const timeValue =
                    typeof e.detail.value === 'string'
                      ? e.detail.value
                      : (e.detail.value as string[])[0];
                  setSelectedTime(timeValue || '');
                }}
              />
            </IonItem>
            {selectedTime && selectedMedicine && (
              <div className="ion-padding">
                <p>
                  Based on the frequency ({selectedMedicine.frequency}), alerts will be set for:
                </p>
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
          message={toastMessage}
          duration={2000}
          color={toastColor}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default AlertScreen;
