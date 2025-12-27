import React, { useState, useEffect } from 'react';

const BusRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch routes
    setTimeout(() => {
      const mockRoutes = [
        {
          id: 1,
          name: 'Civic Center to Maitri Bagh',
          origin: 'Civic Center',
          destination: 'Maitri Bagh',
          estimatedTime: 25,
          estimatedCost: 15,
          nextArrival: '5 min',
          frequency: '10-15 min'
        },
        {
          id: 2,
          name: 'Steel Plant to Durg Station',
          origin: 'Steel Plant Gate',
          destination: 'Durg Railway Station',
          estimatedTime: 35,
          estimatedCost: 20,
          nextArrival: '12 min',
          frequency: '15-20 min'
        },
        {
          id: 3,
          name: 'Civic Center to BIT College',
          origin: 'Civic Center',
          destination: 'BIT College',
          estimatedTime: 30,
          estimatedCost: 18,
          nextArrival: '8 min',
          frequency: '20-25 min'
        },
        {
          id: 4,
          name: 'Maitri Bagh to Raipur',
          origin: 'Maitri Bagh',
          destination: 'Raipur Bus Stand',
          estimatedTime: 45,
          estimatedCost: 25,
          nextArrival: '15 min',
          frequency: '30-40 min'
        }
      ];
      setRoutes(mockRoutes);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2>Loading bus routes...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem', color: '#333' }}>🚌 Bus Routes</h1>
        
        <input
          type="text"
          className="search-box"
          placeholder="Search routes, stops, or destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#666' }}>
            Found {filteredRoutes.length} routes • Real-time tracking available
          </p>
        </div>

        {filteredRoutes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No routes found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          <div>
            {filteredRoutes.map((route) => (
              <div key={route.id} className="route-card">
                <div className="route-header">
                  <div className="route-name">{route.name}</div>
                  <div className="arrival-time">Next: {route.nextArrival}</div>
                </div>
                
                <div>
                  <div className="route-info">
                    🚌 {route.origin} → {route.destination}
                  </div>
                  <div className="route-info">
                    ⏱️ {route.estimatedTime} min • ₹{route.estimatedCost}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>
                    Frequency: {route.frequency}
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary">Track Live</button>
                  <button className="btn" style={{ background: '#28a745', color: 'white' }}>
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div style={{ marginTop: '3rem' }}>
          <div className="grid grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#007bff', margin: '0 0 0.5rem 0' }}>50+</h3>
              <p>Active Routes</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#28a745', margin: '0 0 0.5rem 0' }}>200+</h3>
              <p>Bus Stops</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#dc3545', margin: '0 0 0.5rem 0' }}>24/7</h3>
              <p>Service Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusRoutesPage;