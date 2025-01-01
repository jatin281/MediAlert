import { useState, useEffect } from 'react';
import { Medicine } from '../types/medicine';
import { Alert } from '../types/Alert';
import { useAlerts } from './useAlerts';

interface NextMedicine {
  medicine: Medicine;
  nextAlertTime: string;
  timeUntil: string;
}

export const useNextMedicine = (userId: string | null) => {
  const [nextMedicine, setNextMedicine] = useState<NextMedicine | undefined>(undefined);
  const { medicines, alerts, isLoading } = useAlerts(userId);

  const calculateNextAlert = (currentAlerts: Alert[], currentMedicines: Medicine[]) => {
    const now = new Date();
    let nextAlert: NextMedicine | null = null;
    let earliestTime: Date | null = null;

    currentAlerts.forEach(alert => {
      if (!alert.isEnabled) return;

      const medicine = currentMedicines.find(m => m.id === alert.medicineId);
      if (!medicine) return;

      alert.times.forEach(timeStr => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const alertTime = new Date();
        alertTime.setHours(hours, minutes, 0, 0);

        if (alertTime.getTime() <= now.getTime()) {
          alertTime.setDate(alertTime.getDate() + 1);
        }

        if (!earliestTime || alertTime < earliestTime) {
          earliestTime = alertTime;
          nextAlert = {
            medicine,
            nextAlertTime: timeStr,
            timeUntil: formatTimeUntil(alertTime, now)
          };
        }
      });
    });

    return nextAlert;
  };

  const formatTimeUntil = (alertTime: Date, now: Date): string => {
    const diffMs = alertTime.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs === 0) {
      return `in ${diffMins} minutes`;
    }
    return `in ${diffHrs}h ${diffMins}m`;
  };

  useEffect(() => {
    if (!isLoading && medicines.length > 0 && alerts.length > 0) {
      const next = calculateNextAlert(alerts, medicines);
      setNextMedicine(undefined);
    }
  }, [medicines, alerts, isLoading]);

  return { nextMedicine, isLoading };
};