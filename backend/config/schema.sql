-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_student BOOLEAN DEFAULT FALSE,
    student_id VARCHAR(100),
    institution_email VARCHAR(255),
    preferences JSONB DEFAULT '{"language": "en", "defaultTransportMode": "bus", "accessibilityNeeds": []}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(POINT, 4326)
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    origin_lat DECIMAL(10, 8) NOT NULL,
    origin_lng DECIMAL(11, 8) NOT NULL,
    destination_lat DECIMAL(10, 8) NOT NULL,
    destination_lng DECIMAL(11, 8) NOT NULL,
    transport_mode VARCHAR(50) NOT NULL,
    estimated_time INTEGER,
    estimated_cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bus stops table
CREATE TABLE IF NOT EXISTS bus_stops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    amenities TEXT[],
    accessibility_features TEXT[],
    geom GEOMETRY(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    driver_rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    features TEXT[],
    is_available BOOLEAN DEFAULT TRUE,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    origin_lat DECIMAL(10, 8) NOT NULL,
    origin_lng DECIMAL(11, 8) NOT NULL,
    destination_lat DECIMAL(10, 8) NOT NULL,
    destination_lng DECIMAL(11, 8) NOT NULL,
    estimated_fare DECIMAL(10, 2),
    actual_fare DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Emergency requests table
CREATE TABLE IF NOT EXISTS emergency_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    emergency_type VARCHAR(50) DEFAULT 'general',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    booking_id INTEGER REFERENCES bookings(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_locations_geom ON locations USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_bus_stops_geom ON bus_stops USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_user_id ON emergency_requests(user_id);

-- Insert sample data
INSERT INTO bus_stops (name, latitude, longitude, amenities, accessibility_features) VALUES
('Civic Center', 21.2094, 81.3947, ARRAY['shelter', 'seating', 'lighting'], ARRAY['wheelchair_accessible', 'audio_announcements']),
('Maitri Bagh', 21.1938, 81.3509, ARRAY['shelter', 'seating'], ARRAY['wheelchair_accessible']),
('Steel Plant Gate', 21.2144, 81.4381, ARRAY['shelter', 'seating', 'lighting', 'cctv'], ARRAY['wheelchair_accessible']),
('Durg Railway Station', 21.1905, 81.2849, ARRAY['shelter', 'seating', 'lighting', 'restroom'], ARRAY['wheelchair_accessible', 'audio_announcements']),
('BIT College', 21.1905, 81.2849, ARRAY['shelter', 'seating'], ARRAY['wheelchair_accessible'])
ON CONFLICT DO NOTHING;

INSERT INTO routes (name, origin_lat, origin_lng, destination_lat, destination_lng, transport_mode, estimated_time, estimated_cost) VALUES
('Civic Center to Maitri Bagh', 21.2094, 81.3947, 21.1938, 81.3509, 'bus', 25, 15),
('Steel Plant to Durg Station', 21.2144, 81.4381, 21.1905, 81.2849, 'bus', 35, 20),
('Civic Center to BIT College', 21.2094, 81.3947, 21.1905, 81.2849, 'bus', 30, 18)
ON CONFLICT DO NOTHING;

INSERT INTO vehicles (vehicle_number, type, capacity, driver_name, driver_phone, driver_rating, features) VALUES
('CG07AB1234', 'bus', 40, 'Ramesh Kumar', '9876543210', 4.5, ARRAY['ac', 'gps', 'cctv']),
('CG07CD5678', 'auto', 3, 'Suresh Patel', '9876543211', 4.2, ARRAY['gps']),
('CG07EF9012', 'taxi', 4, 'Mahesh Singh', '9876543212', 4.8, ARRAY['ac', 'gps', 'music_system']),
('CG07GH3456', 'e-rickshaw', 3, 'Prakash Yadav', '9876543213', 4.0, ARRAY['gps'])
ON CONFLICT DO NOTHING;