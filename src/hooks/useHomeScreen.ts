import { useHistory } from 'react-router-dom';
import { clipboardOutline, personCircle, notificationsOutline, locateOutline } from 'ionicons/icons';
import { useNextMedicine } from './useNextMedicine';
import useUserData from './useUserData';
import { FeatureCard } from '../types/home.types';
import { useCallback } from 'react';

export const useHomeScreen = () => {
  const history = useHistory();
  const { userData, loading: userLoading, refreshUserData } = useUserData();
  const { nextMedicine, isLoading: medicineLoading, refreshNextMedicine } = useNextMedicine(userData?.id || null);

  const refreshData = useCallback(() => {
    if (refreshUserData) {
      refreshUserData();
    }
    if (refreshNextMedicine) {
      refreshNextMedicine();
    }
  }, [refreshUserData, refreshNextMedicine]);

  const featureCards: FeatureCard[] = [
    { title: 'Your Meds', icon: clipboardOutline, backgroundColor: '#E8EAFF', route: `/medicine-list?userId=${userData?.id}` },
    { title: 'Prescription', icon: personCircle, backgroundColor: '#FFE8E8', route: '/prescriptions?userId=${userData?.id}' },
    { title: 'Alerts', icon: notificationsOutline, backgroundColor: '#E8F6FF', route: `/alerts?userId=${userData?.id}` },
    { title: 'Track', icon: locateOutline, backgroundColor: '#E8FFEA', route: '/track' },
  ];

  const handleCardClick = (route: string) => {
    history.push(route);
  };

  const handleNextMedicineClick = () => {
    if (userData?.id) {
      history.push(`/alerts?userId=${userData.id}`);
    }
  };

  return {
    userData,
    userLoading,
    nextMedicine,
    medicineLoading,
    featureCards,
    handleCardClick,
    handleNextMedicineClick,
    refreshData
  };
};