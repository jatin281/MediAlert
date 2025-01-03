import React, { useEffect, useRef, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner } from '@ionic/react';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';

interface Pharmacy {
  lat: number;
  lng: number;
  name: string;
}

const TrackScreen: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  let map: GoogleMap | null = null;

  useEffect(() => {
    let resizeObserver: ResizeObserver;

    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Wait for the container to have size
        await new Promise<void>((resolve) => {
          resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
              resolve();
            }
          });
          resizeObserver.observe(mapRef.current!);
        });

        // Get current position
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 5000
        });

        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Create map
        map = await GoogleMap.create({
          id: 'nearby-pharmacies-map',
          element: mapRef.current,
          apiKey: 'AIzaSyBSvmnyd5nkQAQfYEEgELV3nA-eeMJNbZ0',
          config: {
            center: userLocation,
            zoom: 14,
            // Explicitly set dimensions based on container
            width: mapRef.current.offsetWidth,
            height: mapRef.current.offsetHeight
          },
        });

        // Add markers and enable location after map is ready
        await map.addMarker({
          coordinate: userLocation,
          title: 'Your Location',
          iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        const pharmacies: Pharmacy[] = [
          { lat: userLocation.lat + 0.001, lng: userLocation.lng + 0.001, name: 'Pharmacy 1' },
          { lat: userLocation.lat - 0.001, lng: userLocation.lng + 0.002, name: 'Pharmacy 2' },
          { lat: userLocation.lat + 0.002, lng: userLocation.lng - 0.001, name: 'Pharmacy 3' },
        ];

        for (const pharmacy of pharmacies) {
          await map.addMarker({
            coordinate: { lat: pharmacy.lat, lng: pharmacy.lng },
            title: pharmacy.name,
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });
        }

        await map.enableCurrentLocation(true);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to initialize map. Please check permissions and try again.');
        setLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (map) {
        map.destroy();
        map = null;
      }
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nearby Pharmacies</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 999
          }}>
            <IonSpinner name="circles" />
          </div>
        )}
        {error && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 999,
            color: 'red',
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem'
          }}>
            {error}
          </div>
        )}
        <div 
          ref={mapRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '100vh'
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default TrackScreen;