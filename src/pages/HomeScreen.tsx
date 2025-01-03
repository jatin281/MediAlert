import React, { useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSkeletonText,
} from '@ionic/react';
import { useHomeScreen } from '../hooks/useHomeScreen';
import ProfileMenu from '../components/ProfileMenu';
import NextMedicineCard from '../components/NextMedicineCard';

const HomeScreen: React.FC = () => {
  const {
    userData,
    userLoading,
    nextMedicine,
    medicineLoading,
    featureCards,
    handleCardClick,
    handleNextMedicineClick,
    refreshData
  } = useHomeScreen();

  useEffect(() => {
    document.addEventListener('ionViewWillEnter', refreshData);
    return () => {
      document.removeEventListener('ionViewWillEnter', refreshData);
    };
  }, [refreshData]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MediAlert</IonTitle>
          <div slot="end" style={{ paddingRight: '16px' }}>
            <ProfileMenu userImage={userData?.image} />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Welcome Section */}
          <IonRow>
            <IonCol>
              <h2>Welcome,</h2>
              {userLoading ? (
                <IonSkeletonText animated style={{ width: '150px', height: '32px' }} />
              ) : (
                <h1>{userData?.name}</h1>
              )}
            </IonCol>
          </IonRow>

          {/* Next Medicine Card */}
          <NextMedicineCard
            loading={medicineLoading}
            nextMedicine={nextMedicine}
            onClick={handleNextMedicineClick}
          />

          {/* Features Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Features</h2>
            <IonRow style={{ flex: 1, marginBottom: 0 }}>
              {featureCards.map(card => (
                <IonCol 
                  key={card.title} 
                  size="6" 
                  style={{ 
                    display: 'flex',
                    marginBottom: "16px"
                  }}
                >
                  <IonCard 
                    button 
                    onClick={() => handleCardClick(card.route)}
                    style={{ 
                      margin: "0",
                      backgroundColor: card.backgroundColor,
                      borderRadius: "16px",
                      flex: 1,
                      minHeight: '200px', // Increased height
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <IonCardHeader>
                      <IonCardTitle style={{ 
                        textAlign: "center", 
                        fontSize: "18px", // Slightly increased font size
                        fontWeight: "500"
                      }}>
                        {card.title}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent style={{ 
                      textAlign: "center",
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IonIcon icon={card.icon} style={{ fontSize: "48px" }} /> {/* Increased icon size */}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </div>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HomeScreen;