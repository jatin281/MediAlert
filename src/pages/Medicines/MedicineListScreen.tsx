// MedicineListScreen.tsx
import React from 'react';
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
  IonSearchbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToast,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonImg,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { Camera, CameraSource } from '@capacitor/camera';
import { useMedicineLogic } from '../../hooks/useMedicineLogic';
import MedicineCard from '../../components/MedicineCard';
import { Medicine } from '../../types/medicine';

const MedicineListScreen = () => {
  const {
    searchText,
    setSearchText,
    medicines,
    filteredMedicines,
    openModal,
    setShowToast,
    showToast,
    showModal,
    setShowModal,
    newMedicine,
    setNewMedicine,
    handleAddMedicine,
    pickImage,
  } = useMedicineLogic();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Medicines</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSearchbar
          placeholder="Search medicines"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
        />

      <IonList>
        {filteredMedicines.map((medicine, index) => (
          <MedicineCard key={index} medicine={medicine} />
        ))}
      </IonList>

        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton onClick={openModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Inline Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add Medicine</IonTitle>
              <IonButton slot="end" onClick={() => setShowModal(false)}>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput
              label="Name"
              labelPlacement="stacked"
              value={newMedicine.name}
              onIonChange={(e) => setNewMedicine({ ...newMedicine, name: e.detail.value! })}
              placeholder="Enter medicine name"
            />
            <IonInput
              label="Dosage"
              labelPlacement="stacked"
              value={newMedicine.dosage}
              onIonChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.detail.value! })}
              placeholder="Enter dosage"
            />
            <IonSelect
              label="Frequency"
              labelPlacement="stacked"
              value={newMedicine.frequency}
              onIonChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.detail.value! })}
            >
              <IonSelectOption value="Once a day">Once a day</IonSelectOption>
              <IonSelectOption value="Twice a day">Twice a day</IonSelectOption>
              <IonSelectOption value="Three times a day">Three times a day</IonSelectOption>
            </IonSelect>
            <IonTextarea
              label="Details (optional)"
              labelPlacement="stacked"
              value={newMedicine.details}
              onIonChange={(e) => setNewMedicine({ ...newMedicine, details: e.detail.value! })}
              placeholder="Enter any additional details"
            />
            <IonInput
              label="Quantity"
              labelPlacement="stacked"
              type="number"
              value={newMedicine.quantity.toString()} // Convert number to string for IonInput
              onIonChange={(e) => {
                const parsedValue = parseInt(e.detail.value || '0', 10); // Parse string to number
                setNewMedicine({ ...newMedicine, quantity: parsedValue });
              }}
              placeholder="Enter quantity in stock"
            />


            <IonButton expand="block" className="ion-margin-top" onClick={() => pickImage(CameraSource.Camera)}>
              Take Photo (Optional)
            </IonButton>
            <IonButton expand="block" className="ion-margin-top" onClick={() => pickImage(CameraSource.Photos)}>
              Choose from Gallery (Optional)
            </IonButton>

            {newMedicine.image && <IonImg src={newMedicine.image} alt="Medicine Image" />}

            <IonButton expand="block" className="ion-margin-top" onClick={handleAddMedicine}>
              Add Medicine
            </IonButton>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          message="Medicine added successfully!"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default MedicineListScreen;