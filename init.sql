-- Initialize the database extensions
-- Note: The database is automatically created by PostgreSQL via POSTGRES_DB env var
-- UUID extension is already enabled by default in PostgreSQL 13+

-- Create UUID extension if needed (for older PostgreSQL versions)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
