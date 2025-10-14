# Validation Script for Smart Task Planner
# Run this after setting up all services to verify end-to-end functionality

Write-Host "🧠 Smart Task Planner - Setup Validation" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Test 1: Flask AI Engine
Write-Host "`n1️⃣ Testing Flask AI Engine..." -ForegroundColor Yellow
try {
    $flaskTest = python -c "
import sys
sys.path.append('ai-engine')
from ai_engine.app import app
app.config['TESTING'] = True
client = app.test_client()
response = client.post('/generate_plan', json={'goal': 'Test', 'persona': 'startup', 'timeline_days': 5})
print('FLASK_OK' if response.status_code == 200 else 'FLASK_ERROR')
"
    if ($flaskTest -eq "FLASK_OK") {
        Write-Host "✅ Flask AI engine working" -ForegroundColor Green
    } else {
        Write-Host "❌ Flask AI engine failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Flask dependencies missing or Python path issue" -ForegroundColor Red
}

# Test 2: Node.js Dependencies
Write-Host "`n2️⃣ Testing Node.js Dependencies..." -ForegroundColor Yellow
Set-Location "backend"
if (Test-Path "node_modules") {
    Write-Host "✅ Node.js dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Node.js dependencies not installed. Run: npm install" -ForegroundColor Yellow
}
Set-Location ".."

# Test 3: React Dependencies  
Write-Host "`n3️⃣ Testing React Dependencies..." -ForegroundColor Yellow
Set-Location "frontend"
if (Test-Path "node_modules") {
    Write-Host "✅ React dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  React dependencies not installed. Run: npm install" -ForegroundColor Yellow
}
Set-Location ".."

# Test 4: MongoDB Connection
Write-Host "`n4️⃣ Testing MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($mongoTest.TcpTestSucceeded) {
        Write-Host "✅ MongoDB is running on port 27017" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB not detected. Install MongoDB or run: docker run -d -p 27017:27017 mongo:6" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Cannot test MongoDB connection" -ForegroundColor Yellow
}

Write-Host "`n📋 Quick Start Commands:" -ForegroundColor Cyan
Write-Host "1. Flask AI Engine: cd ai-engine; python app.py" -ForegroundColor White
Write-Host "2. Node.js Backend: cd backend; npm install; node index.js" -ForegroundColor White  
Write-Host "3. React Frontend: cd frontend; npm install; npm run dev" -ForegroundColor White
Write-Host "4. Open: http://localhost:5173" -ForegroundColor White

Write-Host "`n🎯 Validation Complete!" -ForegroundColor Green