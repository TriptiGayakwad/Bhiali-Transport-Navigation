import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  }, []);

  const handleEmergencySOS = () => {
    if (window.confirm('This will share your location with emergency services. Continue?')) {
      alert('SOS Activated! Emergency services have been notified of your location.');
    }
  };

  const features = [
    {
      icon: '🚌',
      title: 'Real-time Bus Tracking',
      description: 'Track buses live with accurate arrival times for Bhilai-Durg-Raipur routes'
    },
    {
      icon: '🚗',
      title: 'Auto & Taxi Booking',
      description: 'Book rides instantly with verified drivers and transparent pricing'
    },
    {
      icon: '🚆',
      title: 'Railway Integration',
      description: 'Get train schedules and alerts for Durg & Bhilai Nagar stations'
    },
    {
      icon: '🆘',
      title: 'Emergency Services',
      description: 'One-touch SOS with GPS location sharing and emergency contacts'
    },
    {
      icon: '🎓',
      title: 'Student Features',
      description: 'Special routes and discounts for students of BIT, DPS, St. Thomas'
    },
    {
      icon: '🌱',
      title: 'Eco-Friendly Options',
      description: 'Cycling routes, e-rickshaw stands, and carbon footprint tracking'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Bhilai Transport & Navigation</h1>
          <p>Your comprehensive transport companion for the Bhilai-Durg-Raipur region</p>
          {currentLocation && (
            <p>📍 Current Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}</p>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => window.location.href = '/bus-routes'}>
              Find Bus Routes
            </button>
            <button className="btn btn-danger" onClick={handleEmergencySOS}>
              Emergency SOS
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Complete Transport Solutions</h2>
          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: '3rem 0', background: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Quick Actions</h2>
          <div className="grid grid-2">
            <div className="card">
              <h3>🚌 Bus Routes</h3>
              <p>Find real-time bus information and plan your journey</p>
              <button className="btn btn-primary" onClick={() => window.location.href = '/bus-routes'}>
                View Routes
              </button>
            </div>
            <div className="card">
              <h3>🆘 Emergency Services</h3>
              <p>Quick access to emergency contacts and SOS features</p>
              <button className="btn btn-danger" onClick={() => window.location.href = '/emergency'}>
                Emergency Help
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;