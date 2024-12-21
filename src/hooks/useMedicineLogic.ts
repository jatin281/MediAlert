import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Medicine } from '../types/medicine';

export const useMedicineLogic = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [medicines, setMedicines] = useState<Medicine[]>([
      {
        id: '1',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Twice daily',
        quantity: 50,
        details: 'Take with food. Complete the full course as prescribed.',
        image: '/api/placeholder/48/48'
      },
      {
        id: '2',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 6 hours',
        quantity: 30,
        details: 'Take after meals. Do not exceed 4 tablets in 24 hours.',
        image: '/api/placeholder/48/48'
      },
      {
        id: '3',
        name: 'Vitamin D3',
        dosage: '1000 IU',
        frequency: 'Once daily',
        quantity: 90,
        details: 'Take with your largest meal of the day for better absorption.',
        image: '/api/placeholder/48/48'
      }
    ]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newMedicine, setNewMedicine] = useState<Medicine>({
      id: '',
      name: '',
      dosage: '',
      frequency: '',
      details: '',
      quantity: 0,
      image: '',
    });
    const [showToast, setShowToast] = useState<boolean>(false);
  
    const filteredMedicines = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchText.toLowerCase())
    );
  
    const openModal = () => {
        setNewMedicine({
          id: '',
          name: '',
          dosage: '',
          frequency: '',
          details: '',
          quantity: 0,
          image: '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
      
    const handleAddMedicine = () => {
      setMedicines([...medicines, newMedicine]);
      setShowModal(false);
      setShowToast(true);
    };
  
    const pickImage = async (source: CameraSource) => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source,
      });
      setNewMedicine({ ...newMedicine, image: image.webPath! });
    };
  
    return {
      searchText,
      setSearchText,
      medicines,
      filteredMedicines,
      showModal,
      setShowModal,
      newMedicine,
      setNewMedicine,
      handleAddMedicine,
      showToast,
      setShowToast,
      openModal,
      pickImage,
    };
};