const express = require('express');
const router = express.Router();
const { cache } = require('../config/redis');

// Mock train data for Bhilai-Durg region
const TRAIN_SCHEDULES = {
  'durg': {
    station: 'Durg',
    stationCode: 'DURG',
    trains: [
      {
        trainNumber: '12853',
        trainName: 'Amarkantak Express',
        departure: '06:15',
        arrival: '06:10',
        platform: '1',
        destination: 'Anand Vihar Terminal',
        status: 'On Time'
      },
      {
        trainNumber: '18237',
        trainName: 'Chattisgarh Express',
        departure: '14:30',
        arrival: '14:25',
        platform: '2',
        destination: 'Bilaspur Junction',
        status: 'Delayed by 15 min'
      },
      {
        trainNumber: '12409',
        trainName: 'Gondwana Express',
        departure: '22:45',
        arrival: '22:40',
        platform: '3',
        destination: 'Hazrat Nizamuddin',
        status: 'On Time'
      }
    ]
  },
  'bhilai-nagar': {
    station: 'Bhilai Nagar',
    stationCode: 'BIA',
    trains: [
      {
        trainNumber: '18029',
        trainName: 'Kurukshetra Express',
        departure: '07:20',
        arrival: '07:18',
        platform: '1',
        destination: 'Kurukshetra Junction',
        status: 'On Time'
      },
      {
        trainNumber: '12854',
        trainName: 'Amarkantak Express',
        departure: '19:35',
        arrival: '19:30',
        platform: '2',
        destination: 'Jabalpur Junction',
        status: 'On Time'
      }
    ]
  }
};

// Get train schedules for a station
router.get('/schedules/:station', async (req, res) => {
  try {
    const { station } = req.params;
    const stationKey = station.toLowerCase();
    
    const cacheKey = `train_schedule_${stationKey}`;
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const schedule = TRAIN_SCHEDULES[stationKey];
    if (!schedule) {
      return res.status(404).json({ error: 'Station not found' });
    }

    // Add current time and update status
    const currentTime = new Date();
    const updatedSchedule = {
      ...schedule,
      lastUpdated: currentTime,
      trains: schedule.trains.map(train => ({
        ...train,
        liveStatus: Math.random() > 0.7 ? 'Delayed by ' + Math.floor(Math.random() * 30 + 5) + ' min' : 'On Time'
      }))
    };

    await cache.set(cacheKey, updatedSchedule, 300); // Cache for 5 minutes
    res.json(updatedSchedule);
  } catch (error) {
    console.error('Error fetching train schedules:', error);
    res.status(500).json({ error: 'Failed to fetch train schedules' });
  }
});

// Create delay notification
router.post('/delays', async (req, res) => {
  try {
    const { trainNumber, stationCode, delayMinutes, reason } = req.body;
    
    if (!trainNumber || !stationCode || !delayMinutes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const delay = {
      id: Date.now(),
      trainNumber,
      stationCode,
      delayMinutes,
      reason: reason || 'Technical reasons',
      reportedAt: new Date(),
      status: 'active'
    };

    // In production, this would:
    // 1. Store in database
    // 2. Send push notifications to affected users
    // 3. Update real-time displays

    res.status(201).json({
      message: 'Delay notification created',
      delay
    });
  } catch (error) {
    console.error('Error creating delay notification:', error);
    res.status(500).json({ error: 'Failed to create delay notification' });
  }
});

// Get active delays for a station
router.get('/delays/:stationCode', async (req, res) => {
  try {
    const { stationCode } = req.params;
    
    // Mock delay data
    const delays = [
      {
        id: 1,
        trainNumber: '12853',
        trainName: 'Amarkantak Express',
        delayMinutes: 25,
        reason: 'Signal failure',
        reportedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: 'active'
      }
    ];

    res.json(delays);
  } catch (error) {
    console.error('Error fetching delays:', error);
    res.status(500).json({ error: 'Failed to fetch delays' });
  }
});

// Get IRCTC booking link
router.get('/booking-link/:trainNumber', (req, res) => {
  try {
    const { trainNumber } = req.params;
    
    // Validate train number format
    const trainNumberRegex = /^\d{5}$/;
    if (!trainNumberRegex.test(trainNumber)) {
      return res.status(400).json({ error: 'Invalid train number format' });
    }

    const bookingUrl = `https://www.irctc.co.in/nget/train-search?trainNumber=${trainNumber}`;
    
    res.json({
      trainNumber,
      bookingUrl,
      alternativeBooking: [
        {
          platform: 'ConfirmTkt',
          url: `https://www.confirmtkt.com/train/${trainNumber}`
        },
        {
          platform: 'Trainman',
          url: `https://trainman.in/train/${trainNumber}`
        }
      ]
    });
  } catch (error) {
    console.error('Error generating booking link:', error);
    res.status(500).json({ error: 'Failed to generate booking link' });
  }
});

// Get live train status
router.get('/live-status/:trainNumber', async (req, res) => {
  try {
    const { trainNumber } = req.params;
    
    // Mock live status data
    const liveStatus = {
      trainNumber,
      trainName: 'Amarkantak Express',
      currentStation: 'Raipur Junction',
      nextStation: 'Durg Junction',
      estimatedArrival: '14:25',
      delay: 15,
      lastUpdated: new Date()
    };

    res.json(liveStatus);
  } catch (error) {
    console.error('Error fetching live status:', error);
    res.status(500).json({ error: 'Failed to fetch live status' });
  }
});

module.exports = router;