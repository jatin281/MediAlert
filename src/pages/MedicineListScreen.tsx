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
  IonSearchbar,
} from '@ionic/react';

const MedicineListScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [medicines, setMedicines] = useState<string[]>([
    'Paracetamol',
    'Ibuprofen',
    'Amoxicillin',
    'Cetirizine',
    'Metformin',
    'Aspirin',
    'Vitamin C',
  ]);

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Medicines</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Search Bar */}
        <IonSearchbar
          placeholder="Search medicines"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
        />

        {/* Medicine List */}
        <IonList>
          {filteredMedicines.map((medicine, index) => (
            <IonItem key={index}>
              <IonLabel>{medicine}</IonLabel>
              <IonButton
                slot="end"
                color="primary"
                onClick={() => alert(`Details for ${medicine}`)}
              >
                View Details
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MedicineListScreen;
