-- PostgreSQL Database Initialization Script
-- This script runs when the container starts for the first time

-- Create additional databases if needed
-- CREATE DATABASE IF NOT EXISTS gokselmanav_test_db;

-- Create additional users if needed
-- CREATE USER IF NOT EXISTS gokselmanav_test_user WITH PASSWORD 'test_password_2024';

-- Grant privileges
-- GRANT ALL PRIVILEGES ON DATABASE gokselmanav_test_db TO gokselmanav_test_user;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Create a simple test table to verify database is working
CREATE TABLE IF NOT EXISTS system_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial system info
INSERT INTO system_info (name, value) VALUES 
    ('database_version', 'PostgreSQL 15'),
    ('initialized_at', CURRENT_TIMESTAMP::TEXT),
    ('application', 'GokselManav Backend')
ON CONFLICT (name) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for system_info table
DROP TRIGGER IF EXISTS update_system_info_updated_at ON system_info;
CREATE TRIGGER update_system_info_updated_at
    BEFORE UPDATE ON system_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 