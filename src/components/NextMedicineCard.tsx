import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonSkeletonText,
} from '@ionic/react';
import { Medicine } from '../types/medicine';

interface NextMedicineCardProps {
  loading: boolean;
  nextMedicine: {
    medicine: Medicine;
    nextAlertTime: string;
  } | null;
  onClick: () => void;
}

const NextMedicineCard: React.FC<NextMedicineCardProps> = ({
  loading,
  nextMedicine,
  onClick
}) => {
  return (
    <IonCard 
      onClick={onClick} 
      style={{ 
        margin: "0 0 40px",
        cursor: 'pointer',
        backgroundColor: '#f0f7ff', // Light blue tint
        borderRadius: '20px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        width: '100%'
      }}
    >
      <IonCardContent style={{ padding: '24px' }}>
        <h3 style={{ 
          margin: "0 0 16px", 
          fontSize: '24px',
          fontWeight: '600',
          color: '#000'
        }}>
          Next Medicine
        </h3>
        {loading ? (
          <IonSkeletonText animated style={{ width: '60%', height: '24px' }} />
        ) : nextMedicine ? (
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ 
                fontSize: '18px',
                color: '#000',
                fontWeight: '500'
              }}>
                {nextMedicine.medicine.name}
              </span>
              <span style={{ 
                fontSize: '18px',
                color: '#666'
              }}>
                at {nextMedicine.nextAlertTime}
              </span>
            </div>
            <a 
              style={{ 
                color: "var(--ion-color-primary)", 
                fontSize: "16px",
                textDecoration: 'none',
                display: 'block',
                marginTop: '12px',
                fontWeight: '500'
              }}
            >
              Tell me more →
            </a>
          </div>
        ) : (
          <p style={{ 
            margin: "0", 
            color: "var(--ion-color-medium)",
            fontSize: '18px'
          }}>
            No upcoming medicine alerts
          </p>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default NextMedicineCard;