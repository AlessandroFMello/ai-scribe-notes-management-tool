#!/bin/sh

echo "Waiting for backend to be ready..."

timeout=30
elapsed=0
while [ $elapsed -lt $timeout ]; do
  if nc -z backend 3000 > /dev/null 2>&1; then
    break
  fi
  sleep 1
  elapsed=$((elapsed + 1))
done

if ! nc -z backend 3000 > /dev/null 2>&1; then
  echo "Warning: Backend may not be fully ready, but starting frontend anyway..."
fi

echo "Starting frontend..."

nginx -t

if [ $? -eq 0 ]; then
  sleep 2
  echo "Server running here -> http://localhost:3001"
  exec nginx -g "daemon off;"
else
  echo "Error: Nginx configuration is invalid"
  exit 1
fi

