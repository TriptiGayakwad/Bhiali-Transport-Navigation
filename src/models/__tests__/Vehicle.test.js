const Vehicle = require('../Vehicle');
const Location = require('../Location');

describe('Vehicle Model', () => {
  test('should create valid vehicle', () => {
    const vehicle = new Vehicle('CG07AB1234', 'bus', 40);
    expect(vehicle.vehicleNumber).toBe('CG07AB1234');
    expect(vehicle.type).toBe('bus');
    expect(vehicle.capacity).toBe(40);
    expect(vehicle.isAvailable).toBe(true);
  });

  test('should validate vehicle type', () => {
    expect(() => new Vehicle('CG07AB1234', 'invalid')).toThrow('Invalid vehicle type');
  });

  test('should validate vehicle number format', () => {
    expect(() => new Vehicle('INVALID', 'bus')).toThrow('Invalid vehicle number format');
  });

  test('should update location', () => {
    const vehicle = new Vehicle('CG07AB1234', 'bus');
    vehicle.updateLocation(21.2094, 81.3947);
    
    expect(vehicle.currentLocation).toBeInstanceOf(Location);
    expect(vehicle.currentLocation.latitude).toBe(21.2094);
  });

  test('should set driver information', () => {
    const vehicle = new Vehicle('CG07AB1234', 'bus');
    vehicle.setDriver('John Doe', '9876543210');
    
    expect(vehicle.driverName).toBe('John Doe');
    expect(vehicle.driverPhone).toBe('9876543210');
  });

  test('should add rating', () => {
    const vehicle = new Vehicle('CG07AB1234', 'bus');
    vehicle.addRating(4);
    vehicle.addRating(5);
    
    expect(vehicle.driverRating).toBe(4.5);
    expect(vehicle.totalRatings).toBe(2);
  });

  test('should calculate fare estimate', () => {
    const vehicle = new Vehicle('CG07AB1234', 'auto');
    const fare = vehicle.getFareEstimate(5); // 5km
    
    expect(fare).toBeGreaterThan(0);
    expect(typeof fare).toBe('number');
  });

  test('should get vehicle status', () => {
    const vehicle = new Vehicle('CG07AB1234', 'bus');
    expect(vehicle.getStatus()).toBe('offline');
    
    vehicle.updateLocation(21.2094, 81.3947);
    expect(vehicle.getStatus()).toBe('online');
    
    vehicle.setAvailability(false);
    expect(vehicle.getStatus()).toBe('unavailable');
  });
});