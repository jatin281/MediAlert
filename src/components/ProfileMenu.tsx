// src/components/ProfileMenu.tsx
import React, { useState } from 'react';
import {
  IonAvatar,
  IonPopover,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { logOutOutline, settingsOutline } from 'ionicons/icons';
import useAuth from '../hooks/useAuth';

interface ProfileMenuProps {
  userImage: string | null | undefined;  // Updated type to match UserData
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ userImage }) => {
  const [popoverState, setPopoverState] = useState({ showPopover: false, event: undefined });
  const { handleLogout } = useAuth();

  const defaultImage = "https://via.placeholder.com/150";

  return (
    <>
      <IonAvatar 
        onClick={(e: any) => {
          e.persist();
          setPopoverState({ showPopover: true, event: e });
        }}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={userImage || defaultImage}
          alt="Profile"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
      </IonAvatar>

      <IonPopover
        isOpen={popoverState.showPopover}
        event={popoverState.event}
        onDidDismiss={() => setPopoverState({ showPopover: false, event: undefined })}
      >
        <IonList>
          <IonItem button onClick={() => console.log('Settings clicked')}>
            <IonIcon slot="start" icon={settingsOutline} />
            <IonLabel>Settings</IonLabel>
          </IonItem>
          <IonItem button onClick={handleLogout}>
            <IonIcon slot="start" icon={logOutOutline} />
            <IonLabel>Logout</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>
    </>
  );
};

export default ProfileMenu;