import { useHistory } from 'react-router-dom';
import { clipboardOutline, personCircle, notificationsOutline, locateOutline } from 'ionicons/icons';
import  useUserData  from './useUserData';
import { useNextMedicine } from './useNextMedicine';
import { FeatureCard } from '../types/home.types';

export const useHomeScreen = () => {
  const history = useHistory();
  const { userData, loading: userLoading, error: userError } = useUserData();
  const { nextMedicine, isLoading: medicineLoading } = useNextMedicine(userData?.id || null);

  const featureCards: FeatureCard[] = [
    {
      title: 'Your Meds',
      icon: clipboardOutline,
      backgroundColor: '#E8EAFF',
      route: `/medicine-list?userId=${userData?.id}`
    },
    {
      title: 'Prescription',
      icon: personCircle,
      backgroundColor: '#FFE8E8',
      route: '/prescriptions'
    },
    {
      title: 'Alerts',
      icon: notificationsOutline,
      backgroundColor: '#E8F6FF',
      route: `/alerts?userId=${userData?.id}`
    },
    {
      title: 'Track',
      icon: locateOutline,
      backgroundColor: '#E8FFEA',
      route: '/track'
    }
  ];

  const handleCardClick = (route: string) => {
    if (route.includes('userId') && !userData?.id) {
      console.error('User ID not available');
      return;
    }
    history.push(route);
  };

  const handleNextMedicineClick = () => {
    if (userData?.id && nextMedicine) {
      history.push(`/alerts?userId=${userData.id}`);
    }
  };

  return {
    userData,
    userLoading,
    userError,
    nextMedicine,
    medicineLoading,
    featureCards,
    handleCardClick,
    handleNextMedicineClick
  };
};