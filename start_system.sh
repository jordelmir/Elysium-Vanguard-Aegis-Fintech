#!/bin/bash

# ==========================================
# 🛡️ ELYSIUM VANGUARD: AEGIS AUTO-LAUNCHER
# ==========================================

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Initializing Aegis Prime System Protocols (v7.1)...${NC}"
echo "--------------------------------------------------------"

# Function to kill child processes on exit
cleanup() {
    echo -e "\n${RED}🛑 Shutting down global services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT

# 1. Start Backend (Java Spring Boot) - Port 8080
echo -e "${GREEN}🔹 [1/3] Booting Risk Cortex (Java 21)...${NC}"
cd backend
./gradlew bootRun > ../backend_service.log 2>&1 &
BACKEND_PID=$!
echo "   ↳ PID: $BACKEND_PID (Logs: backend_service.log)"
cd ..

# 2. Start Telemetry Service (Node.js) - Port 8081
echo -e "${GREEN}🔹 [2/3] Activating Biometric Telemetry...${NC}"
cd telemetry-service
npm run start > ../telemetry_service.log 2>&1 &
TELEMETRY_PID=$!
echo "   ↳ PID: $TELEMETRY_PID (Logs: telemetry_service.log)"
cd ..

# 3. Start Frontend (Vite Preview) - Port 4173 (Default)
echo -e "${GREEN}🔹 [3/3] Rendering Holo-Interface...${NC}"
# Allow time for backend to initialize
sleep 5
npm run preview -- --host > frontend_service.log 2>&1 &
FRONTEND_PID=$!
echo "   ↳ PID: $FRONTEND_PID (Logs: frontend_service.log)"

echo "--------------------------------------------------------"
echo -e "${CYAN}✅ SYSTEM ORCHESTRATION COMPLETE${NC}"
echo -e "   🌐 Access Point: ${GREEN}http://localhost:4173${NC}"
echo -e "   📊 Telemetry API: http://localhost:8081/api/telemetry"
echo -e "   🧠 Cortex API: http://localhost:8080"
echo "--------------------------------------------------------"
echo "📜 Tailing operational logs... (Press Ctrl+C to stop)"
echo "--------------------------------------------------------"

# Wait a moment for services to settle then open browser
sleep 8
open http://localhost:4173

# Tail logs to keep script running and show activity
tail -f backend_service.log telemetry_service.log frontend_service.log
