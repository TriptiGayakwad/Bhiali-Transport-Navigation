import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

const BusRoutesScreen = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      // Mock data - in production, fetch from API
      const mockRoutes = [
        {
          id: 1,
          name: 'Civic Center to Maitri Bagh',
          origin: 'Civic Center',
          destination: 'Maitri Bagh',
          estimatedTime: 25,
          estimatedCost: 15,
          nextArrival: '5 min',
          frequency: '10-15 min'
        },
        {
          id: 2,
          name: 'Steel Plant to Durg Station',
          origin: 'Steel Plant Gate',
          destination: 'Durg Railway Station',
          estimatedTime: 35,
          estimatedCost: 20,
          nextArrival: '12 min',
          frequency: '15-20 min'
        },
        {
          id: 3,
          name: 'Civic Center to BIT College',
          origin: 'Civic Center',
          destination: 'BIT College',
          estimatedTime: 30,
          estimatedCost: 18,
          nextArrival: '8 min',
          frequency: '20-25 min'
        }
      ];
      
      setRoutes(mockRoutes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching routes:', error);
      Alert.alert('Error', 'Failed to load bus routes');
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRoute = ({ item }) => (
    <TouchableOpacity
      style={styles.routeCard}
      onPress={() => navigation.navigate('RouteDetails', { route: item })}
    >
      <View style={styles.routeHeader}>
        <Text style={styles.routeName}>{item.name}</Text>
        <Text style={styles.nextArrival}>{item.nextArrival}</Text>
      </View>
      
      <View style={styles.routeDetails}>
        <Text style={styles.routeInfo}>
          🚌 {item.origin} → {item.destination}
        </Text>
        <Text style={styles.routeInfo}>
          ⏱️ {item.estimatedTime} min • ₹{item.estimatedCost}
        </Text>
        <Text style={styles.frequency}>
          Frequency: {item.frequency}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading bus routes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bus Routes</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search routes, stops..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredRoutes}
        renderItem={renderRoute}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.routesList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('RouteSearch')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  routesList: {
    padding: 20,
  },
  routeCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  nextArrival: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  routeDetails: {
    gap: 5,
  },
  routeInfo: {
    fontSize: 14,
    color: '#666666',
  },
  frequency: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default BusRoutesScreen;