class TrafficService {
  constructor() {
    this.trafficEvents = [
      { id: 1, type: 'closure', location: 'Civic Center Main Road', severity: 'high', startTime: new Date(), description: 'Road construction' },
      { id: 2, type: 'festival', location: 'Maitri Bagh Area', severity: 'medium', startTime: new Date(), description: 'Diwali celebrations' }
    ];
  }

  getActiveEvents() {
    return this.trafficEvents.filter(event => event.startTime <= new Date());
  }

  adaptRouteForEvents(route, events) {
    let adaptedRoute = { ...route };
    events.forEach(event => {
      if (this.routeAffectedByEvent(route, event)) {
        adaptedRoute.alternateRoute = this.findAlternateRoute(route, event);
        adaptedRoute.estimatedTime += 15; // Add delay
      }
    });
    return adaptedRoute;
  }

  routeAffectedByEvent(route, event) {
    // Simple check - in production, use proper geospatial analysis
    return route.name.toLowerCase().includes(event.location.toLowerCase().split(' ')[0]);
  }

  findAlternateRoute(route, event) {
    return {
      ...route,
      name: route.name + ' (Alternate)',
      estimatedTime: route.estimatedTime + 10,
      reason: `Avoiding ${event.description}`
    };
  }
}

module.exports = TrafficService;