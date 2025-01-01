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
  IonSkeletonText,
  IonIcon,
} from '@ionic/react';
import { useHomeScreen } from '../hooks/useHomeScreen';
import ProfileMenu from '../components/ProfileMenu';

const HomeScreen: React.FC = () => {
  const {
    userData,
    userLoading,
    userError,
    nextMedicine,
    medicineLoading,
    featureCards,
    handleCardClick,
    handleNextMedicineClick
  } = useHomeScreen();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MediAlert</IonTitle>
          <div slot="end" style={{ paddingRight: "16px" }}>
            <ProfileMenu userImage={userData?.image} />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <h2 style={{ margin: "0", color: "var(--ion-color-medium)" }}>Welcome,</h2>
              {userLoading ? (
                <IonSkeletonText animated style={{ width: '150px', height: '32px' }} />
              ) : (
                <h1 style={{ margin: "4px 0 24px", fontSize: "32px", fontWeight: "600" }}>
                  {userData?.name}
                </h1>
              )}
            </IonCol>
          </IonRow>

          <IonCard style={{ margin: "0 0 32px" }}>
            <IonCardContent>
              <h3 style={{ margin: "0 0 8px", color: "var(--ion-color-medium)" }}>Next Medicine</h3>
              {medicineLoading ? (
                <IonSkeletonText animated style={{ width: '60%' }} />
              ) : nextMedicine ? (
                <>
                  <p style={{ margin: "0" }}>
                    Medicine name here <span style={{ color: "var(--ion-color-medium)" }}>at {nextMedicine.nextAlertTime}</span>
                  </p>
                  <a style={{ color: "var(--ion-color-primary)", fontSize: "14px" }}>Tell me more</a>
                </>
              ) : (
                <p style={{ margin: "0", color: "var(--ion-color-medium)" }}>No upcoming medicine alerts</p>
              )}
            </IonCardContent>
          </IonCard>

          <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Features</h2>
          <IonRow>
            {featureCards.map(card => (
              <IonCol key={card.title} size="6" style={{ marginBottom: "16px" }}>
                <IonCard 
                  button 
                  onClick={() => handleCardClick(card.route)}
                  style={{ 
                    margin: "0",
                    backgroundColor: card.backgroundColor,
                    borderRadius: "16px",
                    height: "140px"
                  }}
                >
                  <IonCardHeader>
                    <IonCardTitle style={{ textAlign: "center", fontSize: "16px" }}>
                      {card.title}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent style={{ textAlign: "center" }}>
                    <IonIcon icon={card.icon} style={{ fontSize: "32px" }} />
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HomeScreen;