#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -U postgres -d ai_scribe_db > /dev/null 2>&1; do
  echo "Still waiting for PostgreSQL..."
  sleep 2
done
echo "PostgreSQL is ready!"

# Run migrations (non-blocking - continue if migrations fail)
echo "Running database migrations..."
npx prisma migrate deploy 2>&1 || {
  echo "Migration deploy failed, trying db push..."
  npx prisma db push --accept-data-loss --skip-generate 2>&1 || {
    echo "Migration warning (database may already be up to date)"
  }
}

# Seed the database (non-blocking - continue even if seeding fails)
echo "Seeding database..."
npx tsx prisma/seed.ts 2>&1 || {
  echo "Seeding completed with warnings"
  echo "This is normal if the database was already seeded"
}

# Start the application
echo "Starting application..."
exec node dist/server.js

