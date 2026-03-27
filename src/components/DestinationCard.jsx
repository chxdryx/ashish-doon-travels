import React, { useState } from 'react';
import { getRouteData } from '../utils/geologic'; 

const DestinationCard = ({ destination, userCoords }) => {
    // 1. Distance aur Loading ki State
    const [dist, setDist] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleClick = async (e) => {
        // StopPropagation taaki agar card ke andar koi button ho toh click clash na kare
        e.stopPropagation();

        if (!userCoords) {
            alert("📍 Location allow karke page refresh karo bhai!");
            return;
        }

        setLoading(true); // Spinner/Loading chalu
        try {
            // Road distance fetch ho raha hai
            const data = await getRouteData(
                userCoords.lng, 
                userCoords.lat, 
                destination.lng, 
                destination.lat
            );
            
            if (data && data.distance) {
                setDist(data.distance);
            } else {
                console.log("No data returned from API");
            }
        } catch (err) {
            console.error("Distance fetch error:", err);
        } finally {
            setLoading(false); // Loading band
        }
    };

    return (
        <div 
            className="card-container" 
            onClick={handleClick} 
            style={{
                background: '#111', 
                color: '#fff', 
                padding: '15px', 
                borderRadius: '15px', 
                cursor: 'pointer', 
                width: '320px',
                border: '1px solid #333',
                transition: 'transform 0.2s',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            {/* Image Section */}
            <div style={{ position: 'relative' }}>
                <img 
                    src={destination.image} 
                    alt={destination.name} 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} 
                />
                <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    background: 'rgba(0,0,0,0.6)', 
                    padding: '2px 8px', 
                    borderRadius: '5px',
                    fontSize: '12px'
                }}>
                    ⭐ 4.8
                </div>
            </div>

            {/* Content Section */}
            <div style={{ marginTop: '15px' }}>
                <h3 style={{ margin: '0', fontSize: '1.4rem' }}>{destination.name}</h3>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '5px 0' }}>
                    {destination.tagline || "Valley of the Doons"}
                </p>
                
                <div className="badges-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    <div className="badge" style={{ background: '#222', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', border: '1px solid #444' }}>
                        🗓️ March—June
                    </div>
                    
                    {/* YAHAN ASLI KM DIKHEGA */}
                    <div className="badge" style={{ 
                        background: '#4caf50', 
                        color: '#fff', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 10px rgba(76, 175, 80, 0.3)'
                    }}>
                        📍 {loading ? 'Calculating...' : (dist ? `${dist} km from you` : 'Tap to find distance')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationCard;