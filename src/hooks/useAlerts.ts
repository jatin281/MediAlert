import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { Medicine } from '../types/medicine';
import { Alert } from '../types/Alert';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const useAlerts = (userId: string | null) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved alerts from preferences
  const loadSavedAlerts = async () => {
    try {
      const { value } = await Preferences.get({ key: `alerts_${userId}` });
      if (value) {
        const savedAlerts = JSON.parse(value);
        setAlerts(savedAlerts);
      }
    } catch (error) {
      console.error('Error loading saved alerts:', error);
    }
  };

  // Save alerts to preferences
  const saveAlerts = async (updatedAlerts: Alert[]) => {
    try {
      await Preferences.set({
        key: `alerts_${userId}`,
        value: JSON.stringify(updatedAlerts)
      });
    } catch (error) {
      console.error('Error saving alerts:', error);
    }
  };

  // Fetch medicines from Firestore
  const fetchMedicines = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const medicinesRef = collection(db, 'users', userId, 'medicines');
      const snapshot = await getDocs(medicinesRef);
      const medicineData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medicine[];
      
      setMedicines(medicineData);
      await loadSavedAlerts(); // Load alerts after medicines are fetched
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [userId]);

  const calculateAlertTimes = (startTime: string, frequency: Medicine['frequency']): string[] => {
    try {
      const times: string[] = [];
      
      const timeMatch = startTime.match(/(\d{2}):(\d{2})/);
      if (!timeMatch) {
        console.error('Invalid time format');
        return [];
      }

      const [_, hours, minutes] = timeMatch;
      const baseDate = new Date();
      baseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
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

      const notifications = alert.times.map((time, index) => {
        const [hours, minutes] = time.split(':').map(Number);
        const schedule = new Date();
        schedule.setHours(hours, minutes, 0, 0);

        if (schedule.getTime() < Date.now()) {
          schedule.setDate(schedule.getDate() + 1);
        }

        console.log("med id:",medicine.id, " index:",index)

        return {
          id:   Math.floor(Date.now() / 1000) + index, // Make sure the ID is within Java int range
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
      console.log('Scheduling notifications with data:', notifications);

    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  };

  const setAlert = async (medicine: Medicine, startTime: string) => {
    try {
      const times = calculateAlertTimes(startTime, medicine.frequency);
      console.log("medi id in setAlert:",medicine.id);
      const newAlert: Alert = {
        medicineId: medicine.id,
        startTime,
        times,
        isEnabled: true
      };

      let updatedAlerts: Alert[] = [];
      setAlerts(prevAlerts => {
        const existingAlertIndex = prevAlerts.findIndex(a => a.medicineId === medicine.id);
        if (existingAlertIndex >= 0) {
          const newAlerts = [...prevAlerts];
          newAlerts[existingAlertIndex] = newAlert;
          updatedAlerts = newAlerts;
          return newAlerts;
        }
        updatedAlerts = [...prevAlerts, newAlert];
        return updatedAlerts;
      });

      await saveAlerts(updatedAlerts);
      await scheduleNotifications(newAlert, medicine);
    } catch (error) {
      console.error('Error setting alert:', error);
    }
  };

  const toggleAlert = async (medicineId: string) => {
    try {
      const medicine = medicines.find(m => m.id === medicineId);
      if (!medicine) return;

      let updatedAlerts: Alert[] = [];
      setAlerts(prevAlerts => {
        const newAlerts = prevAlerts.map(alert => {
          if (alert.medicineId === medicineId) {
            const updatedAlert = { ...alert, isEnabled: !alert.isEnabled };
            scheduleNotifications(updatedAlert, medicine);
            return updatedAlert;
          }
          return alert;
        });
        updatedAlerts = newAlerts;
        return newAlerts;
      });

      await saveAlerts(updatedAlerts);
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  return {
    medicines,
    alerts,
    setAlert,
    toggleAlert,
    calculateAlertTimes,
    isLoading
  };
};

