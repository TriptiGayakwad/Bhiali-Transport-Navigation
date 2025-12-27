const User = require('../User');

describe('User Model', () => {
  test('should create valid user', () => {
    const user = new User('test@example.com', '9876543210', 'Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.phoneNumber).toBe('9876543210');
    expect(user.name).toBe('Test User');
    expect(user.isStudent).toBe(false);
  });

  test('should validate email format', () => {
    expect(() => new User('invalid-email', '9876543210')).toThrow('Invalid email format');
  });

  test('should validate phone number', () => {
    expect(() => new User('test@example.com', '123')).toThrow('Invalid phone number format');
  });

  test('should verify student status', () => {
    const user = new User('test@example.com', '9876543210');
    user.verifyStudentStatus('BIT2021001', 'student@bit.ac.in');
    
    expect(user.isStudent).toBe(true);
    expect(user.studentId).toBe('BIT2021001');
    expect(user.institutionEmail).toBe('student@bit.ac.in');
  });

  test('should add emergency contact', () => {
    const user = new User('test@example.com', '9876543210');
    const contact = user.addEmergencyContact('Emergency Contact', '9876543211', 'personal');
    
    expect(user.emergencyContacts).toHaveLength(1);
    expect(contact.name).toBe('Emergency Contact');
    expect(contact.type).toBe('personal');
  });

  test('should get student discount rates', () => {
    const user = new User('test@example.com', '9876543210');
    user.verifyStudentStatus('BIT2021001', 'student@bit.ac.in');
    
    const discounts = user.getStudentDiscountRate();
    expect(discounts.bus).toBe(0.5);
    expect(discounts.auto).toBe(0.1);
  });
});