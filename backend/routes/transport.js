const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { cache } = require('../config/redis');

// Get all bus stops
router.get('/bus-stops', async (req, res) => {
  try {
    const cacheKey = 'all_bus_stops';
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const result = await pool.query(`
      SELECT id, name, latitude, longitude, amenities, accessibility_features
      FROM bus_stops 
      ORDER BY name
    `);

    await cache.set(cacheKey, result.rows, 1800); // Cache for 30 minutes
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bus stops:', error);
    res.status(500).json({ error: 'Failed to fetch bus stops' });
  }
});

// Get nearby vehicles
router.get('/vehicles/nearby', async (req, res) => {
  try {
    const { latitude, longitude, type, radius = 5 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates are required' });
    }

    // Mock vehicle data (in production, use real-time vehicle tracking)
    const vehicles = [
      {
        id: 1,
        vehicleNumber: 'CG07AB1234',
        type: 'bus',
        driverName: 'Ramesh Kumar',
        driverPhone: '9876543210',
        driverRating: 4.5,
        currentLocation: { latitude: 21.2094, longitude: 81.3947 },
        isAvailable: true,
        estimatedArrival: 5, // minutes
        route: 'Civic Center - Maitri Bagh'
      },
      {
        id: 2,
        vehicleNumber: 'CG07CD5678',
        type: 'auto',
        driverName: 'Suresh Patel',
        driverPhone: '9876543211',
        driverRating: 4.2,
        currentLocation: { latitude: 21.2100, longitude: 81.3950 },
        isAvailable: true,
        estimatedArrival: 3, // minutes
        route: null
      }
    ];

    // Filter by type if specified
    let filteredVehicles = vehicles;
    if (type) {
      filteredVehicles = vehicles.filter(v => v.type === type);
    }

    res.json(filteredVehicles);
  } catch (error) {
    console.error('Error fetching nearby vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch nearby vehicles' });
  }
});

// Book a ride
router.post('/book', async (req, res) => {
  try {
    const { userId, vehicleId, origin, destination, estimatedFare } = req.body;
    
    if (!userId || !vehicleId || !origin || !destination) {
      return res.status(400).json({ error: 'Missing required booking information' });
    }

    // Create booking record
    const result = await pool.query(`
      INSERT INTO bookings (user_id, vehicle_id, origin_lat, origin_lng, 
                           destination_lat, destination_lng, estimated_fare, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *
    `, [userId, vehicleId, origin.latitude, origin.longitude, 
        destination.latitude, destination.longitude, estimatedFare]);

    const booking = result.rows[0];

    // In production, this would:
    // 1. Notify the driver
    // 2. Send confirmation to user
    // 3. Start real-time tracking

    res.status(201).json({
      message: 'Ride booked successfully',
      booking: {
        id: booking.id,
        status: booking.status,
        estimatedFare: booking.estimated_fare,
        createdAt: booking.created_at
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to book ride' });
  }
});

// Get fare estimate
router.post('/fare-estimate', (req, res) => {
  try {
    const { origin, destination, transportMode = 'auto' } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    // Simple distance calculation (Haversine formula)
    const R = 6371; // Earth's radius in km
    const dLat = (destination.latitude - origin.latitude) * Math.PI / 180;
    const dLon = (destination.longitude - origin.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(origin.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Fare calculation
    const baseFare = {
      'bus': 10,
      'auto': 15,
      'taxi': 20,
      'e-rickshaw': 12
    };
    
    const perKmRate = {
      'bus': 2,
      'auto': 8,
      'taxi': 12,
      'e-rickshaw': 6
    };

    const base = baseFare[transportMode] || 15;
    const rate = perKmRate[transportMode] || 8;
    const estimatedFare = Math.round(base + (distance * rate));

    res.json({
      distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      estimatedFare,
      transportMode,
      breakdown: {
        baseFare: base,
        distanceFare: Math.round(distance * rate),
        total: estimatedFare
      }
    });
  } catch (error) {
    console.error('Fare estimation error:', error);
    res.status(500).json({ error: 'Failed to estimate fare' });
  }
});

// Get user bookings
router.get('/bookings/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(`
      SELECT b.*, v.vehicle_number, v.type as vehicle_type, v.driver_name
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
      LIMIT 20
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;