import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonSkeletonText,
} from '@ionic/react';
import { NextMedicineAlert } from '../types/home.types';
import './NextMedicineCard.css';

interface NextMedicineCardProps {
  loading: boolean;
  medicine?: NextMedicineAlert;
  onClick: () => void;
}

export const NextMedicineCard: React.FC<NextMedicineCardProps> = ({
  loading,
  medicine,
  onClick
}) => (
  <IonCard className="next-medicine-card">
    <IonCardContent>
      <h3 className="card-title">Next Medicine</h3>
      {loading ? (
        <IonSkeletonText animated className="medicine-skeleton" />
      ) : medicine ? (
        <div className="medicine-info">
          <p>
            <span className="medicine-name">{medicine.medicine.name}</span>
            <span className="medicine-time">at {medicine.nextAlertTime}</span>
            <span className="time-until">({medicine.timeUntil})</span>
          </p>
          <IonButton fill="clear" className="details-button" onClick={onClick}>
            Tell me more
          </IonButton>
        </div>
      ) : (
        <p className="no-medicine">No upcoming medicine alerts</p>
      )}
    </IonCardContent>
  </IonCard>
);