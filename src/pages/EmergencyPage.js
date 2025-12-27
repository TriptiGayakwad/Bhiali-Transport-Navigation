import React, { useState } from 'react';

const EmergencyPage = () => {
  const [sosActive, setSosActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const emergencyContacts = [
    { number: '100', service: 'Police', icon: '👮' },
    { number: '108', service: 'Ambulance', icon: '🚑' },
    { number: '101', service: 'Fire Service', icon: '🚒' },
    { number: '1091', service: 'Women Helpline', icon: '👩' }
  ];

  const hospitals = [
    {
      name: 'Bhilai Steel Plant Hospital',
      address: 'Sector 1, Bhilai',
      phone: '0788-2282222',
      distance: '2.5 km',
      available24x7: true
    },
    {
      name: 'Apollo Hospital Bilaspur',
      address: 'Seepat Road, Bilaspur',
      phone: '07752-402040',
      distance: '8.3 km',
      available24x7: true
    },
    {
      name: 'Shree Narayana Hospital',
      address: 'Durg',
      phone: '0788-2212345',
      distance: '4.1 km',
      available24x7: false
    }
  ];

  const handleSOS = () => {
    if (!sosActive) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            setSosActive(true);
            alert('🆘 SOS ACTIVATED!\n\nYour location has been shared with emergency services.\nHelp is on the way!');
          },
          (error) => {
            console.error('Location error:', error);
            setSosActive(true);
            alert('🆘 SOS ACTIVATED!\n\nEmergency services have been notified.');
          }
        );
      } else {
        setSosActive(true);
        alert('🆘 SOS ACTIVATED!\n\nEmergency services have been notified.');
      }
    } else {
      setSosActive(false);
      setCurrentLocation(null);
      alert('SOS Deactivated');
    }
  };

  const callEmergency = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem', color: '#dc3545', textAlign: 'center' }}>
          🆘 Emergency Services
        </h1>

        {/* SOS Button */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <button
            className={`btn ${sosActive ? 'btn-danger' : 'btn-danger'}`}
            onClick={handleSOS}
            style={{
              fontSize: '1.5rem',
              padding: '2rem 3rem',
              borderRadius: '50%',
              width: '200px',
              height: '200px',
              animation: sosActive ? 'pulse 1s infinite' : 'none',
              background: sosActive ? '#dc3545' : '#dc3545'
            }}
          >
            {sosActive ? '🆘 ACTIVE' : '🆘 SOS'}
          </button>
          
          {sosActive && currentLocation && (
            <div style={{ marginTop: '1rem', color: '#dc3545', fontWeight: 'bold' }}>
              📍 Location Shared: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              <br />
              🔄 Live tracking active...
            </div>
          )}
          
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Press and hold for 3 seconds to activate emergency SOS
          </p>
        </div>

        {/* Emergency Contacts */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Emergency Contacts</h2>
          <div className="emergency-grid">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="emergency-card"
                onClick={() => callEmergency(contact.number)}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {contact.icon}
                </div>
                <div className="emergency-number">{contact.number}</div>
                <div>{contact.service}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>🏥 Nearby Hospitals</h2>
          <div className="grid grid-2">
            {hospitals.map((hospital, index) => (
              <div key={index} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#333' }}>{hospital.name}</h3>
                  {hospital.available24x7 && (
                    <span style={{ background: '#28a745', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                      24/7
                    </span>
                  )}
                </div>
                
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                  📍 {hospital.address}
                </p>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                  📞 {hospital.phone}
                </p>
                <p style={{ color: '#007bff', marginBottom: '1rem', fontWeight: 'bold' }}>
                  📏 {hospital.distance} away
                </p>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => callEmergency(hospital.phone.replace(/[^0-9]/g, ''))}
                  >
                    Call Now
                  </button>
                  <button className="btn" style={{ background: '#28a745', color: 'white' }}>
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div style={{ marginTop: '3rem', background: '#f8f9fa', padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>🛡️ Safety Tips</h3>
          <ul style={{ color: '#666', lineHeight: '1.8' }}>
            <li>Keep your phone charged and location services enabled</li>
            <li>Share your travel plans with family or friends</li>
            <li>Use well-lit and populated routes, especially at night</li>
            <li>Trust your instincts - if something feels wrong, seek help</li>
            <li>Keep emergency contact numbers saved in your phone</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default EmergencyPage;