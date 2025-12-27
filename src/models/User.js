class User {
  constructor(email, phoneNumber, name = '') {
    this.id = null;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.name = name;
    this.isStudent = false;
    this.studentId = null;
    this.institutionEmail = null;
    this.preferences = {
      language: 'en', // 'en', 'hi', 'chhattisgarhi'
      defaultTransportMode: 'bus',
      accessibilityNeeds: []
    };
    this.emergencyContacts = [];
    this.createdAt = new Date();
    this.lastLogin = null;
    
    this.validate();
  }

  validate() {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Invalid email format');
    }
    
    // Phone number validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(this.phoneNumber.replace(/\D/g, '').slice(-10))) {
      throw new Error('Invalid phone number format');
    }
    
    // Language validation
    const validLanguages = ['en', 'hi', 'chhattisgarhi'];
    if (!validLanguages.includes(this.preferences.language)) {
      throw new Error('Invalid language preference');
    }
    
    // Transport mode validation
    const validModes = ['bus', 'auto', 'taxi', 'e-rickshaw', 'cycling', 'walking'];
    if (!validModes.includes(this.preferences.defaultTransportMode)) {
      throw new Error('Invalid default transport mode');
    }
  }

  // Verify student status
  verifyStudentStatus(studentId, institutionEmail) {
    // Educational institution domains
    const validDomains = [
      'bit.ac.in',           // BIT Durg
      'dpsraipur.com',       // DPS Raipur
      'stthomas.ac.in',      // St. Thomas College
      'nit.ac.in',           // NIT Raipur
      'iiitdmj.ac.in'        // IIIT Jabalpur
    ];
    
    if (!studentId || !institutionEmail) {
      throw new Error('Student ID and institutional email are required');
    }
    
    const emailDomain = institutionEmail.split('@')[1];
    if (!validDomains.includes(emailDomain)) {
      throw new Error('Invalid institutional email domain');
    }
    
    this.isStudent = true;
    this.studentId = studentId;
    this.institutionEmail = institutionEmail;
    
    return true;
  }

  // Add emergency contact
  addEmergencyContact(name, phoneNumber, type = 'personal') {
    const validTypes = ['police', 'ambulance', 'fire', 'personal'];
    if (!validTypes.includes(type)) {
      throw new Error('Invalid emergency contact type');
    }
    
    const contact = {
      name,
      phoneNumber,
      type,
      addedAt: new Date()
    };
    
    this.emergencyContacts.push(contact);
    return contact;
  }

  // Update preferences
  updatePreferences(newPreferences) {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.validate();
  }

  // Add accessibility need
  addAccessibilityNeed(need) {
    const validNeeds = [
      'screen_reader',
      'high_contrast',
      'voice_navigation',
      'large_text',
      'hearing_impaired',
      'mobility_impaired'
    ];
    
    if (!validNeeds.includes(need)) {
      throw new Error('Invalid accessibility need');
    }
    
    if (!this.preferences.accessibilityNeeds.includes(need)) {
      this.preferences.accessibilityNeeds.push(need);
    }
  }

  // Get student discount rate
  getStudentDiscountRate() {
    if (!this.isStudent) return 0;
    
    // Different discount rates for different transport modes
    const discountRates = {
      'bus': 0.5,        // 50% discount
      'auto': 0.1,       // 10% discount
      'taxi': 0.05,      // 5% discount
      'e-rickshaw': 0.2  // 20% discount
    };
    
    return discountRates;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      phoneNumber: this.phoneNumber,
      name: this.name,
      isStudent: this.isStudent,
      studentId: this.studentId,
      institutionEmail: this.institutionEmail,
      preferences: this.preferences,
      emergencyContacts: this.emergencyContacts,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }
}

module.exports = User;