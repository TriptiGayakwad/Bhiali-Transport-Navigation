class LanguageService {
  constructor() {
    this.translations = {
      en: {
        home: 'Home',
        busRoutes: 'Bus Routes',
        emergency: 'Emergency',
        profile: 'Profile',
        searchRoutes: 'Search Routes',
        nearbyVehicles: 'Nearby Vehicles',
        bookRide: 'Book Ride',
        sos: 'SOS',
        settings: 'Settings'
      },
      hi: {
        home: 'होम',
        busRoutes: 'बस रूट',
        emergency: 'आपातकाल',
        profile: 'प्रोफाइल',
        searchRoutes: 'रूट खोजें',
        nearbyVehicles: 'नजदीकी वाहन',
        bookRide: 'राइड बुक करें',
        sos: 'एसओएस',
        settings: 'सेटिंग्स'
      },
      chhattisgarhi: {
        home: 'घर',
        busRoutes: 'बस के रस्ता',
        emergency: 'आपत्काल',
        profile: 'प्रोफाइल',
        searchRoutes: 'रस्ता खोजव',
        nearbyVehicles: 'लकठे के गाड़ी',
        bookRide: 'राइड बुक करव',
        sos: 'एसओएस',
        settings: 'सेटिंग'
      }
    };
    this.currentLanguage = 'en';
  }

  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
    }
  }

  translate(key) {
    return this.translations[this.currentLanguage][key] || key;
  }

  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'chhattisgarhi', name: 'Chhattisgarhi', nativeName: 'छत्तीसगढ़ी' }
    ];
  }
}

export default LanguageService;