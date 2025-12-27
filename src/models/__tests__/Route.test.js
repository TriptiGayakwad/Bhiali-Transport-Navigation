const Route = require('../Route');
const Location = require('../Location');

describe('Route Model', () => {
  const origin = new Location(21.2094, 81.3947); // Civic Center
  const destination = new Location(21.1938, 81.3509); // Maitri Bagh

  test('should create valid route', () => {
    const route = new Route(origin, destination, 'bus');
    expect(route.origin).toBeInstanceOf(Location);
    expect(route.destination).toBeInstanceOf(Location);
    expect(route.transportMode).toBe('bus');
  });

  test('should validate transport mode', () => {
    expect(() => new Route(origin, destination, 'invalid')).toThrow('Invalid transport mode');
  });

  test('should calculate total distance', () => {
    const route = new Route(origin, destination, 'bus');
    const distance = route.getTotalDistance();
    expect(distance).toBeGreaterThan(0);
  });

  test('should estimate travel time', () => {
    const route = new Route(origin, destination, 'bus');
    const time = route.estimateTravelTime();
    expect(time).toBeGreaterThan(0);
    expect(typeof time).toBe('number');
  });

  test('should estimate cost', () => {
    const route = new Route(origin, destination, 'bus');
    const cost = route.estimateCost();
    expect(cost).toBeGreaterThan(0);
    expect(typeof cost).toBe('number');
  });

  test('should find passing landmarks', () => {
    const route = new Route(origin, destination, 'bus');
    const landmarks = route.getPassingLandmarks();
    expect(Array.isArray(landmarks)).toBe(true);
  });
});