import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonAvatar,
  IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { personCircle, clipboardOutline, notificationsOutline, locateOutline } from 'ionicons/icons'; // Replace icons with placeholders

const HomeScreen: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
          <div slot="end" style={{ paddingRight: "16px" }}>
            <IonAvatar>
              <img
                src="https://via.placeholder.com/150" // Placeholder for profile image
                alt="Profile"
              />
            </IonAvatar>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          {/* Welcome Section */}
          <IonRow>
            <IonCol size="12">
              <h2>Welcome,</h2>
              <h1 style={{ fontWeight: "bold" }}>Jatin Chandra</h1>
              <IonButton size="small" fill="outline" style={{ float: "right" }}>
                All Data
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Next Medicine Section */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h3>Next Medicine</h3>
                  <p>Medicine name here at <strong>04:27 PM</strong></p>
                  <IonButton fill="clear" color="primary">
                    Tell me more
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Highlights Section */}
          <IonRow>
            <IonCol size="12">
              <h2>Highlights</h2>
              <IonButton size="small" fill="clear" style={{ float: "right" }}>
                View more
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonCard  button onClick={() => history.push('/medicine-list')}
               style={{ backgroundColor: "#EAF4FE" }}>
                <IonCardHeader>
                  <IonCardTitle style={{ textAlign: "center" }}>Your Meds</IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ textAlign: "center" }}>
                  <IonIcon icon={clipboardOutline} size="large" /> {/* Placeholder */}
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard   button onClick={() => history.push('/prescriptions')}
              style={{ backgroundColor: "#FCEBE8" }}>
                <IonCardHeader>
                  <IonCardTitle style={{ textAlign: "center" }}>Prescription</IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ textAlign: "center" }}>
                  <IonIcon icon={personCircle} size="large" /> {/* Placeholder */}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonCard button onClick={() => history.push('/alerts')}
              style={{ backgroundColor: "#E7F4F4" }}>
                <IonCardHeader>
                  <IonCardTitle style={{ textAlign: "center" }}>Alerts</IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ textAlign: "center" }}>
                  <IonIcon icon={notificationsOutline} size="large" /> {/* Placeholder */}
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard style={{ backgroundColor: "#E9E8FC" }}>
                <IonCardHeader>
                  <IonCardTitle style={{ textAlign: "center" }}>Track</IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ textAlign: "center" }}>
                  <IonIcon icon={locateOutline} size="large" /> {/* Placeholder */}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HomeScreen;
