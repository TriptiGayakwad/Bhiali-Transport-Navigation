class StudentService {
  constructor() {
    this.educationalInstitutions = [
      { name: 'BIT Durg', location: { latitude: 21.1905, longitude: 81.2849 }, type: 'engineering' },
      { name: 'DPS Raipur', location: { latitude: 21.2514, longitude: 81.6296 }, type: 'school' },
      { name: 'St. Thomas College', location: { latitude: 21.2144, longitude: 81.4381 }, type: 'college' },
      { name: 'NIT Raipur', location: { latitude: 21.2514, longitude: 81.6296 }, type: 'engineering' }
    ];
  }

  prioritizeStudentRoutes(routes, userLocation) {
    return routes.map(route => {
      const priority = this.calculateStudentPriority(route);
      return { ...route, studentPriority: priority };
    }).sort((a, b) => b.studentPriority - a.studentPriority);
  }

  calculateStudentPriority(route) {
    let priority = 0;
    this.educationalInstitutions.forEach(institution => {
      const distanceToInstitution = this.calculateDistance(route.destination, institution.location);
      if (distanceToInstitution < 1) priority += 10; // High priority if within 1km
      else if (distanceToInstitution < 3) priority += 5; // Medium priority if within 3km
    });
    return priority;
  }

  calculateDistance(point1, point2) {
    const R = 6371;
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  getStudentDiscounts(transportMode) {
    const discounts = { bus: 0.5, auto: 0.1, taxi: 0.05, 'e-rickshaw': 0.2 };
    return discounts[transportMode] || 0;
  }
}

module.exports = StudentService;