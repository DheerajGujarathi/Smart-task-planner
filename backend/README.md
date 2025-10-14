# Node API Gateway

This Express server proxies requests from the React frontend to the Flask AI engine, and stores plans in MongoDB.

Environment (.env):

- AI_ENGINE_URL=http://localhost:5001
- MONGO_URI=mongodb://localhost:27017/smartplanner
- PORT=4000

Run (PowerShell):

```powershell
cd backend; npm install; $env:AI_ENGINE_URL='http://localhost:5001'; node index.js
```