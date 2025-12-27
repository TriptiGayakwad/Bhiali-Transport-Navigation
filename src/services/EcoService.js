class EcoService {
  constructor() {
    this.cyclingRoutes = [
      { id: 1, name: 'Civic Center Cycling Path', distance: 5.2, difficulty: 'easy' },
      { id: 2, name: 'Maitri Bagh Green Route', distance: 3.8, difficulty: 'easy' },
      { id: 3, name: 'Steel Plant Eco Trail', distance: 7.1, difficulty: 'moderate' }
    ];
    
    this.chargingStations = [
      { id: 1, name: 'Civic Center E-Station', location: { latitude: 21.2094, longitude: 81.3947 }, available: 8, total: 10 },
      { id: 2, name: 'Maitri Bagh Charging Hub', location: { latitude: 21.1938, longitude: 81.3509 }, available: 5, total: 8 }
    ];
  }

  prioritizeEcoFriendlyOptions(transportOptions) {
    const ecoRanking = { cycling: 5, 'e-rickshaw': 4, bus: 3, auto: 2, taxi: 1 };
    return transportOptions.sort((a, b) => (ecoRanking[b.mode] || 0) - (ecoRanking[a.mode] || 0));
  }

  calculateCarbonFootprint(distance, transportMode) {
    const emissions = { bus: 0.05, auto: 0.15, taxi: 0.12, 'e-rickshaw': 0.02, cycling: 0, walking: 0 };
    return (emissions[transportMode] || 0.1) * distance;
  }

  getEcoIncentives(transportMode, distance) {
    const points = { cycling: 10, 'e-rickshaw': 5, bus: 2 };
    return (points[transportMode] || 0) * Math.floor(distance);
  }
}

module.exports = EcoService;