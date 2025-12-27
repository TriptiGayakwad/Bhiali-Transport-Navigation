import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineService {
  constructor() {
    this.cacheKeys = {
      routes: 'cached_routes',
      userPrefs: 'user_preferences',
      emergencyContacts: 'emergency_contacts',
      frequentRoutes: 'frequent_routes'
    };
  }

  async cacheFrequentRoutes(routes) {
    try {
      await AsyncStorage.setItem(this.cacheKeys.frequentRoutes, JSON.stringify(routes));
    } catch (error) {
      console.error('Cache error:', error);
    }
  }

  async getCachedRoutes() {
    try {
      const cached = await AsyncStorage.getItem(this.cacheKeys.frequentRoutes);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return [];
    }
  }

  async syncData() {
    // Sync cached data when online
    const cachedData = await this.getAllCachedData();
    // In production, send to server
    return cachedData;
  }

  async getAllCachedData() {
    const data = {};
    for (const [key, storageKey] of Object.entries(this.cacheKeys)) {
      try {
        const cached = await AsyncStorage.getItem(storageKey);
        data[key] = cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error(`Error getting ${key}:`, error);
      }
    }
    return data;
  }
}

export default OfflineService;