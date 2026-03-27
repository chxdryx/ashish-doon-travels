import React, { useState, useEffect } from 'react';
import DestinationCard from './components/DestinationCard';
import MapSection from './components/MapSection'; // Agar tune banaya hai

function App() {
  const [userCoords, setUserCoords] = useState(null);

  // User ki current location nikalne ke liye
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => console.error("Location permission denied", err)
    );
  }, []);

  const myDestinations = [
    { id: 'dehradun', name: 'Dehradun', lat: 30.3165, lng: 78.0322, image: 'https://via.placeholder.com/150' },
    { id: 'mussoorie', name: 'Mussoorie', lat: 30.4598, lng: 78.0644, image: 'https://via.placeholder.com/150' }
  ];

  return (
    <div className="app-container">
      <h1>Ashish Doon Travels</h1>
      <div className="cards-grid" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {myDestinations.map(dest => (
          <DestinationCard 
            key={dest.id} 
            destination={dest} 
            userCoords={userCoords} 
          />
        ))}
      </div>
      {/* Tera Map Section yahan aayega */}
      {/* <MapSection userCoords={userCoords} /> */}
    </div>
  );
}

export default App;