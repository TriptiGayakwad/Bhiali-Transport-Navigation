const Location = require('./Location');

class Route {
  constructor(origin, destination, transportMode = 'bus', waypoints = []) {
    this.id = null;
    this.origin = origin instanceof Location ? origin : new Location(origin.latitude, origin.longitude);
    this.destination = destination instanceof Location ? destination : new Location(destination.latitude, destination.longitude);
    this.transportMode = transportMode;
    this.waypoints = waypoints.map(wp => wp instanceof Location ? wp : new Location(wp.latitude, wp.longitude));
    this.estimatedTime = null;
    this.estimatedCost = null;
    this.createdAt = new Date();
    
    this.validate();
  }

  validate() {
    const validModes = ['bus', 'auto', 'taxi', 'e-rickshaw', 'cycling', 'walking'];
    if (!validModes.includes(this.transportMode)) {
      throw new Error(`Invalid transport mode: ${this.transportMode}`);
    }
    
    if (this.origin.distanceTo(this.destination) < 0.1) {
      throw new Error('Origin and destination are too close (less than 100m)');
    }
  }

  // Calculate total distance including waypoints
  getTotalDistance() {
    let totalDistance = 0;
    let currentLocation = this.origin;
    
    // Add distance through waypoints
    for (const waypoint of this.waypoints) {
      totalDistance += currentLocation.distanceTo(waypoint);
      currentLocation = waypoint;
    }
    
    // Add final distance to destination
    totalDistance += currentLocation.distanceTo(this.destination);
    
    return totalDistance;
  }

  // Estimate travel time based on transport mode and distance
  estimateTravelTime() {
    const distance = this.getTotalDistance();
    const speedKmh = {
      'bus': 25,
      'auto': 30,
      'taxi': 35,
      'e-rickshaw': 20,
      'cycling': 15,
      'walking': 5
    };
    
    const speed = speedKmh[this.transportMode] || 25;
    this.estimatedTime = Math.round((distance / speed) * 60); // in minutes
    return this.estimatedTime;
  }

  // Estimate cost based on transport mode and distance
  estimateCost() {
    const distance = this.getTotalDistance();
    const baseFare = {
      'bus': 10,
      'auto': 15,
      'taxi': 20,
      'e-rickshaw': 12,
      'cycling': 0,
      'walking': 0
    };
    
    const perKmRate = {
      'bus': 2,
      'auto': 8,
      'taxi': 12,
      'e-rickshaw': 6,
      'cycling': 0,
      'walking': 0
    };
    
    const base = baseFare[this.transportMode] || 10;
    const rate = perKmRate[this.transportMode] || 5;
    
    this.estimatedCost = base + (distance * rate);
    return this.estimatedCost;
  }

  // Check if route passes through landmarks
  getPassingLandmarks() {
    const landmarks = [
      { name: 'Civic Center', location: new Location(21.2094, 81.3947) },
      { name: 'Maitri Bagh', location: new Location(21.1938, 81.3509) },
      { name: 'BIT Durg', location: new Location(21.1905, 81.2849) },
      { name: 'Bhilai Steel Plant', location: new Location(21.2144, 81.4381) }
    ];
    
    const passingLandmarks = [];
    const proximityThreshold = 0.5; // 500 meters
    
    landmarks.forEach(landmark => {
      // Check if route passes near landmark
      const distanceFromOrigin = this.origin.distanceTo(landmark.location);
      const distanceFromDestination = this.destination.distanceTo(landmark.location);
      const routeDistance = this.origin.distanceTo(this.destination);
      
      // Simple check: if landmark is roughly on the path
      if (Math.abs((distanceFromOrigin + distanceFromDestination) - routeDistance) < proximityThreshold) {
        passingLandmarks.push(landmark);
      }
    });
    
    return passingLandmarks;
  }

  toJSON() {
    return {
      id: this.id,
      origin: this.origin.toJSON(),
      destination: this.destination.toJSON(),
      transportMode: this.transportMode,
      waypoints: this.waypoints.map(wp => wp.toJSON()),
      estimatedTime: this.estimatedTime,
      estimatedCost: this.estimatedCost,
      totalDistance: this.getTotalDistance(),
      createdAt: this.createdAt
    };
  }
}

module.exports = Route;