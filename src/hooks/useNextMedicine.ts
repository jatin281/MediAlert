import { useState, useEffect, useCallback } from 'react';
import { Medicine } from '../types/medicine';
import { Alert } from '../types/Alert';
import { useAlerts } from './useAlerts';
import storage from '../storage';

interface NextMedicine {
  medicine: Medicine;
  nextAlertTime: string;
}

export const useNextMedicine = (userId: string | null) => {
  const [nextMedicine, setNextMedicine] = useState<NextMedicine | null>(null);
  const { medicines, isLoading } = useAlerts(userId);

  const calculateNextAlert = async (medicineData: Medicine[]) => {
    const now = new Date();
    let nearestAlert: NextMedicine | null = null;
    let earliestTime: Date | null = null;

    // Get alerts from storage
    const savedAlerts = await storage.get('alerts') || [];
    const activeAlerts = savedAlerts.filter((alert: Alert) => alert.isEnabled);

    activeAlerts.forEach((alert: Alert) => {
      const medicine = medicineData.find((m) => m.id === alert.medicineId);
      if (!medicine) return;

      alert.times.forEach((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const alertTime = new Date();
        alertTime.setHours(hours, minutes, 0, 0);

        if (alertTime <= now) {
          alertTime.setDate(alertTime.getDate() + 1);
        }

        if (!earliestTime || alertTime < earliestTime) {
          earliestTime = alertTime;
          nearestAlert = {
            medicine,
            nextAlertTime: time,
          };
        }
      });
    });

    return nearestAlert;
  };

  const loadNextMedicine = useCallback(async () => {
    if (!isLoading && medicines.length > 0) {
      const nearestAlert = await calculateNextAlert(medicines);
      setNextMedicine(nearestAlert);
    }
  }, [medicines, isLoading]);

  const refreshNextMedicine = useCallback(() => {
    loadNextMedicine();
  }, [loadNextMedicine]);

  useEffect(() => {
    loadNextMedicine();
  }, [loadNextMedicine]);

  return { nextMedicine, isLoading, refreshNextMedicine };
};