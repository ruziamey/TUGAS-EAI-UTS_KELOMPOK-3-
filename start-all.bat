@echo off
REM Script to start all services for E-Wallet (Windows)
REM Usage: start-all.bat

echo Starting E-Wallet Services...

start "API Gateway" cmd /k "cd gateway && npm start"
timeout /t 3 /nobreak >nul

start "User Service" cmd /k "cd services\user-service && npm start"
timeout /t 3 /nobreak >nul

start "Wallet Service" cmd /k "cd services\wallet-service && npm start"
timeout /t 3 /nobreak >nul

start "Transaction Service" cmd /k "cd services\transaction-service && npm start"
timeout /t 3 /nobreak >nul

start "Frontend" cmd /k "cd frontend && npm start"
timeout /t 3 /nobreak >nul

echo.
echo All services started in separate windows!
echo.
echo Services running:
echo   - API Gateway: http://localhost:3000
echo   - Swagger UI: http://localhost:3000/api-docs
echo   - Frontend: http://localhost:5173
echo.
pause



