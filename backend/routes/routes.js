const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { cache } = require('../config/redis');

// Get all bus routes
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'all_routes';
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const result = await pool.query(`
      SELECT id, name, origin_lat, origin_lng, destination_lat, destination_lng, 
             transport_mode, estimated_time, estimated_cost
      FROM routes 
      ORDER BY name
    `);

    await cache.set(cacheKey, result.rows, 300); // Cache for 5 minutes
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Search routes by origin and destination
router.post('/search', async (req, res) => {
  try {
    const { origin, destination, transportMode } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    const cacheKey = `route_search_${origin.lat}_${origin.lng}_${destination.lat}_${destination.lng}_${transportMode || 'all'}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    // Simple route calculation (in production, use proper routing algorithm)
    const routes = [
      {
        id: 1,
        name: `Route from ${origin.name || 'Origin'} to ${destination.name || 'Destination'}`,
        origin: origin,
        destination: destination,
        transportMode: transportMode || 'bus',
        estimatedTime: Math.round(Math.random() * 60 + 15), // 15-75 minutes
        estimatedCost: Math.round(Math.random() * 50 + 10), // ₹10-60
        distance: Math.round(Math.random() * 20 + 2), // 2-22 km
        waypoints: []
      }
    ];

    await cache.set(cacheKey, routes, 600); // Cache for 10 minutes
    res.json(routes);
  } catch (error) {
    console.error('Error searching routes:', error);
    res.status(500).json({ error: 'Failed to search routes' });
  }
});

// Get route by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM routes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// Create new route
router.post('/', async (req, res) => {
  try {
    const { name, origin_lat, origin_lng, destination_lat, destination_lng, transport_mode } = req.body;
    
    const result = await pool.query(`
      INSERT INTO routes (name, origin_lat, origin_lng, destination_lat, destination_lng, transport_mode)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, origin_lat, origin_lng, destination_lat, destination_lng, transport_mode]);

    // Clear cache
    await cache.del('all_routes');
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: 'Failed to create route' });
  }
});

module.exports = router;