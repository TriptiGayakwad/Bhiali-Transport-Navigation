const request = require('supertest');
const app = require('../server');

describe('Railway Features', () => {
  describe('Train Schedule API', () => {
    test('should fetch train schedules for Durg station', async () => {
      const response = await request(app)
        .get('/api/railway/schedules/durg')
        .expect(200);
      
      expect(response.body).toHaveProperty('station', 'Durg');
      expect(Array.isArray(response.body.trains)).toBe(true);
    });

    test('should fetch train schedules for Bhilai Nagar station', async () => {
      const response = await request(app)
        .get('/api/railway/schedules/bhilai-nagar')
        .expect(200);
      
      expect(response.body).toHaveProperty('station', 'Bhilai Nagar');
      expect(Array.isArray(response.body.trains)).toBe(true);
    });

    test('should return 404 for invalid station', async () => {
      await request(app)
        .get('/api/railway/schedules/invalid-station')
        .expect(404);
    });
  });

  describe('Train Delay Notifications', () => {
    test('should create delay notification', async () => {
      const delayData = {
        trainNumber: '12853',
        stationCode: 'DURG',
        delayMinutes: 30,
        reason: 'Signal failure'
      };

      const response = await request(app)
        .post('/api/railway/delays')
        .send(delayData)
        .expect(201);
      
      expect(response.body).toHaveProperty('message', 'Delay notification created');
      expect(response.body.delay).toMatchObject(delayData);
    });

    test('should get active delays for station', async () => {
      const response = await request(app)
        .get('/api/railway/delays/DURG')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Railway Booking Links', () => {
    test('should provide IRCTC booking link', async () => {
      const response = await request(app)
        .get('/api/railway/booking-link/12853')
        .expect(200);
      
      expect(response.body).toHaveProperty('bookingUrl');
      expect(response.body.bookingUrl).toContain('irctc.co.in');
    });

    test('should validate train number format', async () => {
      await request(app)
        .get('/api/railway/booking-link/invalid')
        .expect(400);
    });
  });
});