class Location {
  constructor(latitude, longitude, accuracy = null, timestamp = null) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.accuracy = accuracy;
    this.timestamp = timestamp || new Date();
    
    this.validate();
  }

  validate() {
    if (typeof this.latitude !== 'number' || this.latitude < -90 || this.latitude > 90) {
      throw new Error('Invalid latitude: must be between -90 and 90');
    }
    
    if (typeof this.longitude !== 'number' || this.longitude < -180 || this.longitude > 180) {
      throw new Error('Invalid longitude: must be between -180 and 180');
    }
    
    if (this.accuracy !== null && (typeof this.accuracy !== 'number' || this.accuracy < 0)) {
      throw new Error('Invalid accuracy: must be a positive number or null');
    }
  }

  // Calculate distance to another location (Haversine formula)
  distanceTo(otherLocation) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(otherLocation.latitude - this.latitude);
    const dLon = this.toRadians(otherLocation.longitude - this.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(this.latitude)) * Math.cos(this.toRadians(otherLocation.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Check if location is within Bhilai-Durg-Raipur region
  isInServiceArea() {
    // Approximate bounds for Bhilai-Durg-Raipur region
    const bounds = {
      north: 21.3,
      south: 21.0,
      east: 81.5,
      west: 81.0
    };
    
    return this.latitude >= bounds.south && this.latitude <= bounds.north &&
           this.longitude >= bounds.west && this.longitude <= bounds.east;
  }

  toJSON() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      accuracy: this.accuracy,
      timestamp: this.timestamp
    };
  }

  toString() {
    return `Location(${this.latitude}, ${this.longitude})`;
  }
}

module.exports = Location;