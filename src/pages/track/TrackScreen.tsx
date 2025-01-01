// import React, { useEffect, useRef } from 'react';
// import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
// import { GoogleMap } from '@capacitor/google-maps';

// const TrackScreen: React.FC = () => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   let map: GoogleMap | null = null;

//   useEffect(() => {
//     const initializeMap = async () => {
//       if (!mapRef.current) return;

//       map = await GoogleMap.create({
//         id: 'nearby-pharmacies-map',
//         element: mapRef.current,
//         apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
//         config: {
//           center: {
//             lat: 28.6139, // Replace with user's latitude
//             lng: 77.2090, // Replace with user's longitude
//           },
//           zoom: 14,
//         },
//       });

//       // Add nearby pharmacies markers (example data)
//       const pharmacies = [
//         { lat: 28.6149, lng: 77.2098, name: 'Pharmacy 1' },
//         { lat: 28.6155, lng: 77.2102, name: 'Pharmacy 2' },
//       ];

//       pharmacies.forEach((pharmacy) => {
//         map?.addMarker({
//           coordinate: { lat: pharmacy.lat, lng: pharmacy.lng },
//           title: pharmacy.name,
//         });
//       });
//     };

//     initializeMap();

//     return () => {
//       if (map) {
//         map.destroy();
//         map = null;
//       }
//     };
//   }, []);

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Nearby Pharmacies</IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent>
//         <div
//           ref={mapRef}
//           style={{ width: '100%', height: '100%', position: 'absolute' }}
//         />
//       </IonContent>
//     </IonPage>
//   );
// };

// export default TrackScreen;
