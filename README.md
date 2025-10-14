# Smart Task Planner — Pro Edition 🧠💥

Turn vague goals into intelligent, actionable plans with AI reasoning, timelines, and visualization.

## Architecture

```
React Frontend (port 5173)
   ↓ HTTP requests
Node.js API Gateway (port 4000)
   ↓ proxies to
Flask AI Engine (port 5001)
   ↓ stores plans in
MongoDB (port 27017)
```

## Features Implemented

✅ **AI Personas for Planning Styles** - Startup/Corporate/Creative modes adjust task allocations  
✅ **Task Breakdown Engine** - Flask + heuristic planning (LangChain-ready)  
✅ **AI Feedback Loop** - Basic reasoning critique of generated plans  
✅ **Interactive UI** - React frontend with goal input and persona selection  
✅ **Timeline Visualization** - Mermaid Gantt charts showing task dependencies  
✅ **PDF Export** - ReportLab-generated professional reports  
✅ **Persistent Storage** - MongoDB integration for plan history  

## Quick Start (Windows PowerShell)

### Prerequisites

1. **Python 3.8+** and **Node.js 16+**
2. **MongoDB** - Install locally or run via Docker:
   ```powershell
   docker run -d -p 27017:27017 --name mongo mongo:6
   ```

### 1. Start the AI Engine (Flask)

```powershell
cd "d:\Smart Task Planner\ai-engine"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Flask server starts on **http://localhost:5001**

### 2. Start the API Gateway (Node.js)

```powershell
cd "d:\Smart Task Planner\backend"
npm install
$env:AI_ENGINE_URL='http://localhost:5001'; $env:MONGO_URI='mongodb://localhost:27017'; node index.js
```

Backend starts on **http://localhost:4000**

### 3. Start the Frontend (React)

```powershell
cd "d:\Smart Task Planner\frontend"
npm install
npm run dev
```

Frontend available at **http://localhost:5173**

## Usage

1. Open **http://localhost:5173** in your browser
2. Enter your goal (e.g., "Launch a product in 2 weeks")
3. Select a persona (Startup/Corporate/Creative)
4. Click **Generate Plan**
5. View the generated task breakdown and Gantt chart
6. Click **Download PDF** to export as a report

## API Endpoints

### Backend (Node.js - port 4000)
- `POST /api/generate` - Generate new plan
- `GET /api/plans/:id` - Retrieve saved plan
- `POST /api/export/pdf` - Export plan as PDF

### AI Engine (Flask - port 5001)
- `POST /generate_plan` - Core planning logic
- `POST /export/pdf` - PDF generation

## Sample API Usage

```powershell
# Test plan generation
$body = @{
    goal = "Build a mobile app"
    persona = "startup"
    timeline_days = 21
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/generate" -Method POST -Body $body -ContentType "application/json"
```

## Configuration

Copy `.env.example` files and customize:

```powershell
# AI Engine
cp ai-engine\.env.example ai-engine\.env

# Backend
cp backend\.env.example backend\.env
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite, Mermaid.js | UI & visualizations |
| API Gateway | Node.js + Express | Request routing, data persistence |
| AI Engine | Flask + LangChain (ready) | Task generation, reasoning |
| Database | MongoDB | Plan storage & history |
| Export | ReportLab | PDF generation |

## Project Structure

```
Smart Task Planner/
├── ai-engine/          # Flask AI service
│   ├── app.py          # Main Flask app
│   ├── requirements.txt
│   └── .env.example
├── backend/            # Node.js API gateway
│   ├── index.js        # Express server
│   ├── package.json
│   └── .env.example
├── frontend/           # React UI
│   ├── src/App.jsx     # Main component
│   ├── package.json
│   └── vite.config.js
└── README.md          # This file
```

## Next Steps / Enhancements

### Ready for LLM Integration
- Replace heuristic planning in `ai-engine/app.py` with LangChain + OpenAI/Gemini
- Add your API keys to `.env` files

### Additional Features
- Google Calendar integration (OAuth flow)
- Plan versioning and comparison
- Team collaboration features
- Advanced timeline optimization
- Custom task templates

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running: `docker ps` or check local service
- Update `MONGO_URI` in backend `.env`

**Port Conflicts:**
- Change ports in respective config files if needed
- Default ports: Flask (5001), Node (4000), React (5173)

**CORS Errors:**
- Ensure all services are running on specified ports
- Check browser network tab for specific error details

---

**Built with:** Flask, Node.js, React, MongoDB, LangChain (ready), Mermaid.js, ReportLab