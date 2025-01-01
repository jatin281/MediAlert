import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
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
  IonSpinner,
  IonButton,
  IonSearchbar,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useMedicineLogic } from '../../hooks/useMedicineLogic';
import MedicineCard from '../../components/MedicineCard';
import { Medicine } from '../../types/medicine';

const MedicineListScreen: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');

  console.log("userId: ",userId);

  // State for UI controls
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: false,
    dosage: false,
    frequency: false,
    quantity: false
  });
  
  // Initialize empty medicine object
  const initialMedicine = {
    name: '',
    dosage: '',
    frequency: '',
    details: '',
    quantity: 0,
    image: ''
  };
  
  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id'>>(initialMedicine);

  const { medicines, addMedicine, isLoading, refreshMedicines } = useMedicineLogic(userId || '');

  // Filter medicines based on search text
  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const validateForm = (): boolean => {
    const errors = {
      name: !newMedicine.name.trim(),
      dosage: !newMedicine.dosage.trim(),
      frequency: !newMedicine.frequency.trim(),
      quantity: newMedicine.quantity <= 0
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const pickImage = async (source: CameraSource) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source
      });
      
      if (image.dataUrl) {
        setNewMedicine({ ...newMedicine, image: image.dataUrl });
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const resetForm = () => {
    setNewMedicine(initialMedicine);
    setFormErrors({
      name: false,
      dosage: false,
      frequency: false,
      quantity: false
    });
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setToastMessage('User authentication error. Please try again.');
      setShowToast(true);
      return;
    }

    if (!validateForm()) {
      setToastMessage('Please fill in all required fields');
      setShowToast(true);
      return;
    }

    try {
      const success = await addMedicine(newMedicine);
      
      if (success) {
        setShowModal(false);
        setToastMessage('Medicine added successfully!');
        setShowToast(true);
        resetForm();
        await refreshMedicines();
      } else {
        setToastMessage('Failed to add medicine. Please try again.');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      setToastMessage('An error occurred while adding medicine');
      setShowToast(true);
    }
  };

  if (!userId) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div className="ion-text-center">
            <h2>Authentication Error</h2>
            <p>Unable to load medicines. Please try again.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>My Medicines</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSearchbar
          placeholder="Search medicines"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
        />

        {isLoading ? (
          <div className="loader-container">
            <IonSpinner />
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="empty-container">
            <p>No medicines found. Add your first medicine using the + button.</p>
          </div>
        ) : (
          <IonList>
            {filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

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
            <form onSubmit={handleAddMedicine}>
              <IonInput
                label="Name"
                labelPlacement="stacked"
                value={newMedicine.name}
                onIonChange={(e) => setNewMedicine({ ...newMedicine, name: e.detail.value! })}
                placeholder="Enter medicine name"
                className={formErrors.name ? 'ion-invalid' : ''}
                errorText="Name is required"
              />
              <IonInput
                label="Dosage"
                labelPlacement="stacked"
                value={newMedicine.dosage}
                onIonChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.detail.value! })}
                placeholder="Enter dosage"
                className={formErrors.dosage ? 'ion-invalid' : ''}
                errorText="Dosage is required"
              />
              <IonSelect
                label="Frequency"
                labelPlacement="stacked"
                value={newMedicine.frequency}
                onIonChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.detail.value! })}
                className={formErrors.frequency ? 'ion-invalid' : ''}
                placeholder="Select frequency"
              >
                <IonSelectOption value="Once a day">Once a day</IonSelectOption>
                <IonSelectOption value="Twice a day">Twice a day</IonSelectOption>
                <IonSelectOption value="Three times a day">Three times a day</IonSelectOption>
              </IonSelect>
              {formErrors.frequency && (
                <div className="ion-padding-start" style={{ color: 'var(--ion-color-danger)' }}>
                  Frequency is required
                </div>
              )}
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
                min="0"
                value={newMedicine.quantity}
                onIonChange={(e) => {
                  const parsedValue = parseInt(e.detail.value || '0', 10);
                  setNewMedicine({ ...newMedicine, quantity: parsedValue });
                }}
                placeholder="Enter quantity in stock"
                className={formErrors.quantity ? 'ion-invalid' : ''}
                errorText="Quantity must be 0 or greater"
              />

              <IonButton 
                expand="block" 
                className="ion-margin-top" 
                onClick={() => pickImage(CameraSource.Camera)}
                type="button"
              >
                Take Photo
              </IonButton>
              <IonButton 
                expand="block" 
                className="ion-margin-top" 
                onClick={() => pickImage(CameraSource.Photos)}
                type="button"
              >
                Choose from Gallery
              </IonButton>

              {newMedicine.image && (
                <div className="ion-margin-top">
                  <IonImg src={newMedicine.image} alt="Medicine" />
                </div>
              )}

              <IonButton 
                expand="block" 
                className="ion-margin-top" 
                type="submit"
              >
                Add Medicine
              </IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default MedicineListScreen;