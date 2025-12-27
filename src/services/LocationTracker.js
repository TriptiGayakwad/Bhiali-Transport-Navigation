import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
const Location = require('../models/Location');

class LocationTracker {
  constructor() {
    this.watchId = null;
    this.currentLocation = null;
    this.isTracking = false;
    this.listeners = [];
    this.options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      distanceFilter: 10 // Update every 10 meters
    };
  }

  // Request location permissions
  async requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bhilai Transport App needs access to your location for navigation and real-time tracking.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Location permission error:', err);
        return false;
      }
    }
    
    // iOS permissions are handled automatically
    return true;
  }

  // Get current position once
  async getCurrentPosition() {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location = new Location(
            position.coords.latitude,
            position.coords.longitude,
            position.coords.accuracy,
            new Date(position.timestamp)
          );
          
          this.currentLocation = location;
          resolve(location);
        },
        (error) => {
          console.error('GPS Error:', error);
          reject(new Error(`GPS Error: ${error.message}`));
        },
        this.options
      );
    });
  }

  // Start continuous location tracking
  async startTracking() {
    if (this.isTracking) {
      return;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    this.watchId = Geolocation.watchPosition(
      (position) => {
        const location = new Location(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy,
          new Date(position.timestamp)
        );
        
        this.currentLocation = location;
        this.notifyListeners(location);
      },
      (error) => {
        console.error('GPS Tracking Error:', error);
        this.notifyListeners(null, error);
      },
      this.options
    );

    this.isTracking = true;
  }

  // Stop location tracking
  stopTracking() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
  }

  // Add location update listener
  addListener(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of location updates
  notifyListeners(location, error = null) {
    this.listeners.forEach(callback => {
      try {
        callback(location, error);
      } catch (err) {
        console.error('Listener error:', err);
      }
    });
  }

  // Validate location accuracy
  isLocationAccurate(location, requiredAccuracy = 50) {
    if (!location || !location.accuracy) {
      return false;
    }
    
    return location.accuracy <= requiredAccuracy;
  }

  // Check if location is in service area
  isInServiceArea(location) {
    if (!location) return false;
    return location.isInServiceArea();
  }

  // Get distance from current location
  getDistanceFromCurrent(targetLocation) {
    if (!this.currentLocation || !targetLocation) {
      return null;
    }
    
    return this.currentLocation.distanceTo(targetLocation);
  }

  // Mock location for testing (development only)
  setMockLocation(latitude, longitude, accuracy = 10) {
    if (__DEV__) {
      const mockLocation = new Location(latitude, longitude, accuracy);
      this.currentLocation = mockLocation;
      this.notifyListeners(mockLocation);
      return mockLocation;
    }
    
    throw new Error('Mock location only available in development mode');
  }

  // Get current location or null
  getCurrentLocation() {
    return this.currentLocation;
  }

  // Check if currently tracking
  getTrackingStatus() {
    return {
      isTracking: this.isTracking,
      hasLocation: this.currentLocation !== null,
      lastUpdate: this.currentLocation ? this.currentLocation.timestamp : null
    };
  }
}

export default LocationTracker;