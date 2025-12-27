const Location = require('./Location');

class Vehicle {
  constructor(vehicleNumber, type, capacity = 4) {
    this.id = null;
    this.vehicleNumber = vehicleNumber;
    this.type = type;
    this.capacity = capacity;
    this.currentLocation = null;
    this.isAvailable = true;
    this.driverName = '';
    this.driverPhone = '';
    this.driverRating = 0;
    this.totalRatings = 0;
    this.features = [];
    this.createdAt = new Date();
    this.lastUpdated = new Date();
    
    this.validate();
  }

  validate() {
    const validTypes = ['bus', 'auto', 'taxi', 'e-rickshaw'];
    if (!validTypes.includes(this.type)) {
      throw new Error(`Invalid vehicle type: ${this.type}`);
    }
    
    if (typeof this.capacity !== 'number' || this.capacity < 1) {
      throw new Error('Capacity must be a positive number');
    }
    
    // Vehicle number validation (Indian format)
    const vehicleNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    if (!vehicleNumberRegex.test(this.vehicleNumber.replace(/\s/g, ''))) {
      throw new Error('Invalid vehicle number format');
    }
  }

  // Update current location
  updateLocation(latitude, longitude, accuracy = null) {
    this.currentLocation = new Location(latitude, longitude, accuracy);
    this.lastUpdated = new Date();
  }

  // Set driver information
  setDriver(name, phone) {
    if (!name || name.trim().length < 2) {
      throw new Error('Driver name must be at least 2 characters');
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, '').slice(-10))) {
      throw new Error('Invalid driver phone number');
    }
    
    this.driverName = name.trim();
    this.driverPhone = phone;
  }

  // Add rating
  addRating(rating, comment = '') {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    // Update average rating
    const totalScore = this.driverRating * this.totalRatings;
    this.totalRatings += 1;
    this.driverRating = (totalScore + rating) / this.totalRatings;
    
    return {
      rating,
      comment,
      timestamp: new Date()
    };
  }

  // Add vehicle feature
  addFeature(feature) {
    const validFeatures = [
      'ac',
      'gps',
      'music_system',
      'wheelchair_accessible',
      'first_aid',
      'fire_extinguisher',
      'cctv',
      'wifi'
    ];
    
    if (!validFeatures.includes(feature)) {
      throw new Error('Invalid vehicle feature');
    }
    
    if (!this.features.includes(feature)) {
      this.features.push(feature);
    }
  }

  // Check availability
  setAvailability(isAvailable) {
    this.isAvailable = Boolean(isAvailable);
    this.lastUpdated = new Date();
  }

  // Get vehicle status
  getStatus() {
    if (!this.isAvailable) return 'unavailable';
    if (!this.currentLocation) return 'offline';
    
    // Check if location is recent (within 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (this.lastUpdated < fiveMinutesAgo) return 'offline';
    
    return 'online';
  }

  // Calculate distance from a location
  distanceFrom(location) {
    if (!this.currentLocation) return null;
    return this.currentLocation.distanceTo(location);
  }

  // Get fare estimate for a route
  getFareEstimate(distance) {
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
    
    const base = baseFare[this.type] || 10;
    const rate = perKmRate[this.type] || 5;
    
    return base + (distance * rate);
  }

  toJSON() {
    return {
      id: this.id,
      vehicleNumber: this.vehicleNumber,
      type: this.type,
      capacity: this.capacity,
      currentLocation: this.currentLocation ? this.currentLocation.toJSON() : null,
      isAvailable: this.isAvailable,
      driverName: this.driverName,
      driverPhone: this.driverPhone,
      driverRating: Math.round(this.driverRating * 10) / 10, // Round to 1 decimal
      totalRatings: this.totalRatings,
      features: this.features,
      status: this.getStatus(),
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated
    };
  }
}

module.exports = Vehicle;