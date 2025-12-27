const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bhilai_transport',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Initialize PostGIS extension
const initPostGIS = async () => {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('PostGIS extension enabled');
  } catch (error) {
    console.error('Error enabling PostGIS:', error);
  }
};

// Create tables
const createTables = async () => {
  try {
    // Locations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        accuracy INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        geom GEOMETRY(POINT, 4326)
      );
    `);

    // Routes table
    await pool.query(`
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
    `);

    // Bus stops table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bus_stops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        amenities TEXT[],
        accessibility_features TEXT[],
        geom GEOMETRY(POINT, 4326)
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

module.exports = {
  pool,
  initPostGIS,
  createTables
};