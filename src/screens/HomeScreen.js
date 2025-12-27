import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import LocationTracker from '../services/LocationTracker';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationTracker] = useState(new LocationTracker());

  useEffect(() => {
    initializeLocation();
    return () => {
      locationTracker.stopTracking();
    };
  }, []);

  const initializeLocation = async () => {
    try {
      const location = await locationTracker.getCurrentPosition();
      setCurrentLocation(location);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Unable to get your current location. Please enable GPS and try again.');
    }
  };

  const handleEmergencySOS = () => {
    Alert.alert(
      'Emergency SOS',
      'This will share your location with emergency services. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Activate SOS', 
          style: 'destructive',
          onPress: () => {
            // In production, this would activate real SOS
            Alert.alert('SOS Activated', 'Emergency services have been notified of your location.');
          }
        }
      ]
    );
  };

  const quickActions = [
    {
      title: 'Find Bus Routes',
      subtitle: 'Real-time bus tracking',
      color: '#007bff',
      onPress: () => navigation.navigate('BusRoutes')
    },
    {
      title: 'Book Auto/Taxi',
      subtitle: 'Quick ride booking',
      color: '#28a745',
      onPress: () => navigation.navigate('BookRide')
    },
    {
      title: 'Train Schedules',
      subtitle: 'Durg & Bhilai stations',
      color: '#6f42c1',
      onPress: () => navigation.navigate('TrainSchedules')
    },
    {
      title: 'Emergency SOS',
      subtitle: 'Quick help access',
      color: '#dc3545',
      onPress: handleEmergencySOS
    }
  ];

  const studentFeatures = [
    {
      title: 'Student Routes',
      subtitle: 'Routes to colleges',
      onPress: () => navigation.navigate('StudentRoutes')
    },
    {
      title: 'Student Discounts',
      subtitle: 'Special fare rates',
      onPress: () => navigation.navigate('StudentDiscounts')
    }
  ];

  const ecoFeatures = [
    {
      title: 'Cycling Routes',
      subtitle: 'Eco-friendly paths',
      onPress: () => navigation.navigate('CyclingRoutes')
    },
    {
      title: 'E-Rickshaw Stands',
      subtitle: 'Green transport options',
      onPress: () => navigation.navigate('ERickshawStands')
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bhilai Transport</Text>
        <Text style={styles.headerSubtitle}>Your local transport companion</Text>
        {currentLocation && (
          <Text style={styles.locationText}>
            📍 Current Location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={action.onPress}
            >
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Student Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎓 Student Features</Text>
        <View style={styles.featureList}>
          {studentFeatures.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={feature.onPress}
            >
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Eco-Friendly Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌱 Eco-Friendly Transport</Text>
        <View style={styles.featureList}>
          {ecoFeatures.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={feature.onPress}
            >
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚨 Emergency Contacts</Text>
        <View style={styles.emergencyGrid}>
          <TouchableOpacity style={styles.emergencyCard}>
            <Text style={styles.emergencyNumber}>100</Text>
            <Text style={styles.emergencyLabel}>Police</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.emergencyCard}>
            <Text style={styles.emergencyNumber}>108</Text>
            <Text style={styles.emergencyLabel}>Ambulance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.emergencyCard}>
            <Text style={styles.emergencyNumber}>101</Text>
            <Text style={styles.emergencyLabel}>Fire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 12,
    color: '#e3f2fd',
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
  },
  featureList: {
    gap: 10,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  emergencyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emergencyCard: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  emergencyNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emergencyLabel: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 5,
  },
});

export default HomeScreen;