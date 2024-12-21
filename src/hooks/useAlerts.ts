import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Medicine } from '../types/medicine';
import { Alert } from '../types/Alert';

export const useAlerts = (medicines: Medicine[]) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const calculateAlertTimes = (startTime: string, frequency: Medicine['frequency']): string[] => {
    try {
      const times: string[] = [];
      
      // Parse the time value into hours and minutes
      const timeMatch = startTime.match(/(\d{2}):(\d{2})/);
      if (!timeMatch) {
        console.error('Invalid time format');
        return [];
      }

      const [_, hours, minutes] = timeMatch;
      const baseDate = new Date();
      baseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Define intervals with a default value
      const intervals: Record<Medicine['frequency'], number> = {
        'Once a day': 24,
        'Twice a day': 12,
        'Three times a day': 8
      };

      const intervalHours = intervals[frequency];
      if (!intervalHours) {
        console.error('Invalid frequency');
        return [];
      }

      const alertCount = 24 / intervalHours;
      
      for (let i = 0; i < alertCount; i++) {
        const alertTime = new Date(baseDate.getTime() + i * intervalHours * 60 * 60 * 1000);
        times.push(
          alertTime.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: undefined
          })
        );
      }
      
      return times;
    } catch (error) {
      console.error('Error calculating alert times:', error);
      return [];
    }
  };

  const scheduleNotifications = async (alert: Alert, medicine: Medicine) => {
    try {
      if (!alert.isEnabled) {
        // Cancel existing notifications for this medicine
        const notifications = await LocalNotifications.getPending();
        const medicineNotifications = notifications.notifications.filter(
          n => n.extra && n.extra.medicineId === medicine.id
        );
        await Promise.all(
          medicineNotifications.map(n =>
            LocalNotifications.cancel({ notifications: [{ id: n.id }] })
          )
        );
        return;
      }

      // Schedule new notifications
      const notifications = alert.times.map((time, index) => {
        const [hours, minutes] = time.split(':').map(Number);
        const schedule = new Date();
        schedule.setHours(hours, minutes, 0, 0);

        // If time has passed today, schedule for tomorrow
        if (schedule.getTime() < Date.now()) {
          schedule.setDate(schedule.getDate() + 1);
        }

        return {
          id: parseInt(`${medicine.id}${index}`, 10),
          title: `Time to take ${medicine.name}`,
          body: `Dosage: ${medicine.dosage}`,
          schedule: { at: schedule, repeating: true },
          extra: {
            medicineId: medicine.id
          }
        };
      });

      await LocalNotifications.schedule({
        notifications
      });
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  };

  const setAlert = async (medicine: Medicine, startTime: string) => {
    try {
      const times = calculateAlertTimes(startTime, medicine.frequency);
      const newAlert: Alert = {
        medicineId: medicine.id,
        startTime,
        times,
        isEnabled: true
      };

      setAlerts(prevAlerts => {
        const existingAlertIndex = prevAlerts.findIndex(a => a.medicineId === medicine.id);
        if (existingAlertIndex >= 0) {
          const updatedAlerts = [...prevAlerts];
          updatedAlerts[existingAlertIndex] = newAlert;
          return updatedAlerts;
        }
        return [...prevAlerts, newAlert];
      });

      await scheduleNotifications(newAlert, medicine);
    } catch (error) {
      console.error('Error setting alert:', error);
    }
  };

  const toggleAlert = async (medicineId: string) => {
    try {
      const medicine = medicines.find(m => m.id === medicineId);
      if (!medicine) return;

      setAlerts(prevAlerts => 
        prevAlerts.map(alert => {
          if (alert.medicineId === medicineId) {
            const updatedAlert = { ...alert, isEnabled: !alert.isEnabled };
            scheduleNotifications(updatedAlert, medicine);
            return updatedAlert;
          }
          return alert;
        })
      );
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  return {
    alerts,
    setAlert,
    toggleAlert,
    calculateAlertTimes
  };
};