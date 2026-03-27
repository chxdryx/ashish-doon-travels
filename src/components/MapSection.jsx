import React, { useState, useEffect } from 'react';
import DestinationCard from './DestinationCard'; 
import { getRouteData } from '../utils/geologic';

const MapSection = () => {
  const [userCoords, setUserCoords] = useState(null);

  // 1. Browser se User ki Location nikalna
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setUserCoords(coords);
          console.log("📍 User Coords found:", coords);
        },
        (err) => console.error("❌ Location Denied", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // 2. Destinations Data
  const destinations = [
    { id: 'dehradun', name: 'Dehradun', lat: 30.3165, lng: 78.0322, image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d' },
    { id: 'mussoorie', name: 'Mussoorie', lat: 30.4598, lng: 78.0644, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23' },
    { id: 'haridwar', name: 'Haridwar', lat: 29.9457, lng: 78.1642, image: 'https://images.unsplash.com/photo-1594632168340-9b8702c611f7' }
  ];

  return (
    <section className="destinations-section" style={{ padding: '40px 20px', background: '#000', minHeight: '100vh' }}>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Top Destinations</h2>
      
      {/* Cards Container */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px', 
        justifyContent: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {destinations.map((dest) => (
          <DestinationCard 
            key={dest.id} 
            destination={dest} 
            userCoords={userCoords} 
          />
        ))}
      </div>

      {/* Map Placeholder */}
      <div id="map" style={{ height: '300px', marginTop: '40px', borderRadius: '15px', background: '#111', border: '1px solid #333' }}>
        <p style={{ color: '#666', textAlign: 'center', lineHeight: '300px' }}>Map View Coming Soon</p>
      </div>
    </section>
  );
};

export default MapSection;