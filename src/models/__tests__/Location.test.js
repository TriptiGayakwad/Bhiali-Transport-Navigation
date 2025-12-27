const Location = require('../Location');

describe('Location Model', () => {
  test('should create valid location', () => {
    const location = new Location(21.2094, 81.3947);
    expect(location.latitude).toBe(21.2094);
    expect(location.longitude).toBe(81.3947);
    expect(location.timestamp).toBeInstanceOf(Date);
  });

  test('should validate latitude range', () => {
    expect(() => new Location(91, 81.3947)).toThrow('Invalid latitude');
    expect(() => new Location(-91, 81.3947)).toThrow('Invalid latitude');
  });

  test('should validate longitude range', () => {
    expect(() => new Location(21.2094, 181)).toThrow('Invalid longitude');
    expect(() => new Location(21.2094, -181)).toThrow('Invalid longitude');
  });

  test('should calculate distance between locations', () => {
    const loc1 = new Location(21.2094, 81.3947); // Civic Center
    const loc2 = new Location(21.1938, 81.3509); // Maitri Bagh
    const distance = loc1.distanceTo(loc2);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(10); // Should be less than 10km
  });

  test('should check service area', () => {
    const bhilaiLocation = new Location(21.2094, 81.3947);
    const outsideLocation = new Location(28.6139, 77.2090); // Delhi
    
    expect(bhilaiLocation.isInServiceArea()).toBe(true);
    expect(outsideLocation.isInServiceArea()).toBe(false);
  });
});