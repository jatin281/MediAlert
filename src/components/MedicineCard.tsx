import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { Medicine } from '../types/medicine';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="medicine-card">
      <div 
        className="card-content ion-padding"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="card-header">
          <div className="image-container">
            <div className="medicine-image" />
          </div>
          
          <div className="medicine-info">
            <h3>{medicine.name}</h3>
            <p className="dosage-text">{medicine.dosage} • {medicine.frequency}</p>
          </div>
          
          <div className="quantity-info">
            <span className="quantity-number">{medicine.quantity}</span>
            <span className="quantity-label">remaining</span>
          </div>
        </div>
        
        {isExpanded && (
          <div className="details-section">
            <p>{medicine.details}</p>
          </div>
        )}
        
        <div className="card-footer">
          <IonIcon 
            icon={isExpanded ? chevronUp : chevronDown} 
            className="expand-icon"
          />
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
