import React from 'react';
import { IonAvatar } from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface ProfileMenuProps {
  userImage: string | null | undefined; // Updated type to match UserData
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ userImage }) => {
  const history = useHistory();
  const defaultImage = "https://via.placeholder.com/150";

  const navigateToProfile = () => {
    history.push('/profile'); // Navigates to the ProfileScreen
  };

  return (
    <IonAvatar 
      onClick={navigateToProfile} // Navigate to ProfileScreen on avatar click
      style={{ cursor: 'pointer', width: '40px', height: '40px' }} // Adjust the size
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
  );
};

export default ProfileMenu;
