const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Emergency contacts
const EMERGENCY_CONTACTS = {
  police: { name: 'Police', number: '100' },
  ambulance: { name: 'Ambulance', number: '108' },
  fire: { name: 'Fire Service', number: '101' },
  women_helpline: { name: 'Women Helpline', number: '1091' },
  child_helpline: { name: 'Child Helpline', number: '1098' }
};

// Get emergency contacts
router.get('/contacts', (req, res) => {
  res.json(EMERGENCY_CONTACTS);
});

// Activate SOS
router.post('/sos', async (req, res) => {
  try {
    const { userId, latitude, longitude, emergencyType = 'general' } = req.body;
    
    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ error: 'User ID and location are required' });
    }

    // Create SOS record
    const result = await pool.query(`
      INSERT INTO emergency_requests (user_id, latitude, longitude, emergency_type, status)
      VALUES ($1, $2, $3, $4, 'active')
      RETURNING *
    `, [userId, latitude, longitude, emergencyType]);

    const sosRequest = result.rows[0];

    // In production, this would:
    // 1. Send SMS to emergency contacts
    // 2. Notify nearby emergency services
    // 3. Start live location sharing
    // 4. Send push notifications to emergency contacts

    res.status(201).json({
      message: 'SOS activated successfully',
      sosId: sosRequest.id,
      emergencyContacts: EMERGENCY_CONTACTS,
      location: {
        latitude,
        longitude,
        timestamp: sosRequest.created_at
      }
    });
  } catch (error) {
    console.error('SOS activation error:', error);
    res.status(500).json({ error: 'Failed to activate SOS' });
  }
});

// Deactivate SOS
router.post('/sos/:id/deactivate', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE emergency_requests 
      SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'SOS request not found' });
    }

    res.json({
      message: 'SOS deactivated successfully',
      sosRequest: result.rows[0]
    });
  } catch (error) {
    console.error('SOS deactivation error:', error);
    res.status(500).json({ error: 'Failed to deactivate SOS' });
  }
});

// Find nearby hospitals
router.get('/hospitals', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates are required' });
    }

    // Mock hospital data (in production, use real hospital database)
    const hospitals = [
      {
        id: 1,
        name: 'Bhilai Steel Plant Hospital',
        address: 'Sector 1, Bhilai',
        phone: '0788-2282222',
        latitude: 21.2144,
        longitude: 81.4381,
        distance: 2.5,
        specialties: ['Emergency', 'Cardiology', 'Orthopedics'],
        available24x7: true
      },
      {
        id: 2,
        name: 'Apollo Hospital Bilaspur',
        address: 'Seepat Road, Bilaspur',
        phone: '07752-402040',
        latitude: 22.0797,
        longitude: 82.1409,
        distance: 8.3,
        specialties: ['Emergency', 'Neurology', 'Oncology'],
        available24x7: true
      },
      {
        id: 3,
        name: 'Shree Narayana Hospital',
        address: 'Durg',
        phone: '0788-2212345',
        latitude: 21.1905,
        longitude: 81.2849,
        distance: 4.1,
        specialties: ['Emergency', 'Pediatrics', 'Gynecology'],
        available24x7: false
      }
    ];

    // Filter by radius and sort by distance
    const nearbyHospitals = hospitals
      .filter(hospital => hospital.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyHospitals);
  } catch (error) {
    console.error('Hospital search error:', error);
    res.status(500).json({ error: 'Failed to find nearby hospitals' });
  }
});

// Get active SOS requests for user
router.get('/sos/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM emergency_requests 
      WHERE user_id = $1 AND status = 'active'
      ORDER BY created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('SOS fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch SOS requests' });
  }
});

module.exports = router;