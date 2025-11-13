#!/bin/bash

# Script to start all services for E-Wallet
# Usage: ./start-all.sh

echo "🚀 Starting E-Wallet Services..."

# Start services in background
echo "Starting API Gateway..."
cd gateway && npm start &
GATEWAY_PID=$!

sleep 2

echo "Starting User Service..."
cd ../services/user-service && npm start &
USER_PID=$!

sleep 2

echo "Starting Wallet Service..."
cd ../wallet-service && npm start &
WALLET_PID=$!

sleep 2

echo "Starting Transaction Service..."
cd ../transaction-service && npm start &
TRANSACTION_PID=$!

sleep 2

echo "Starting Frontend..."
cd ../../frontend && npm start &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo ""
echo "Services running:"
echo "  - API Gateway: http://localhost:3000"
echo "  - Swagger UI: http://localhost:3000/api-docs"
echo "  - Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $GATEWAY_PID $USER_PID $WALLET_PID $TRANSACTION_PID $FRONTEND_PID; exit" INT
wait



