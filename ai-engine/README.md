# AI Engine (Flask)

This service exposes endpoints for task generation and reasoning. It's a lightweight prototype that uses LangChain-like pipelines (placeholders) and the Gemini API.

Environment

- Create a .env with:
  - OPENAI_API_KEY (or GEMINI_API_KEY)
  - MONGO_URI (if used)

Run (from this folder)

Windows PowerShell:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt; python app.py
```