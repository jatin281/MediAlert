import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonAvatar
} from '@ionic/react';
import  useUserData  from '../../hooks/useUserData'; // Hook to get user data
import  useAuth  from '../../hooks/useAuth';

const ProfileScreen: React.FC = () => {
  const { userData, loading, error } = useUserData();
  const { handleLogout } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    image: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        gender: userData.gender || '',
        dateOfBirth: userData.dateOfBirth || '',
        image: userData.image || ''
      });
    }
  }, [userData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <IonAvatar style={{ margin: 'auto', width: '100px', height: '100px' }}>
            <img src={formData.image || 'default-avatar.png'} alt="Profile" />
          </IonAvatar>
        </div>

        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput
            name="name"
            value={formData.name}
            readonly
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Gender</IonLabel>
          <IonInput
            name="gender"
            value={formData.gender}
            readonly
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Date of Birth</IonLabel>
          <IonInput
            name="dateOfBirth"
            type="text"
            value={formData.dateOfBirth}
            readonly
          />
        </IonItem>

        <IonButton expand="block" onClick={handleLogout} style={{ marginTop: '20px' }}>
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfileScreen;
