# CarbonWise SL 🌿

**AI-Powered Household Electricity Carbon Prediction, Explainability, and Reduction Web Application for Urban Sri Lankan Households**

> CIS6035 Software Engineering Development Project · BSc (Hons) Software Engineering 
> Kuruppu Arachchige Madhuka Virajith · St20311741

---

## What It Does

CarbonWise SL is the **first AI-powered electricity carbon tracker built specifically for Sri Lanka**. It uses three machine learning models to:

1. **Predict** your household's daily and monthly CO₂ emissions from electricity (XGBoost regression)
2. **Explain** which appliances cause the most emissions — with a SHAP waterfall chart showing each appliance's exact contribution
3. **Profile** your household behaviour pattern using K-Means clustering and generate personalised recommendations
4. **Simulate** the impact of behaviour changes before you commit (what-if simulator)
5. **Calculate** Solar ROI using SLSEA city-level irradiance data

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js · Recharts · React Router |
| Backend API | FastAPI (Python) · Uvicorn |
| AI Models | XGBoost · K-Means · SHAP (scikit-learn) |
| Model Serialisation | Pickle (.pkl) |
| Backend Deployment | Docker → Render.com |
| Frontend Deployment | Vercel |
| Database | Firebase Firestore (emission history) |
| Data Sources | SLSEA 2024 · CEB Tariff 2024 · UCI Dataset |

---

## Project Structure

```
carbonwise-sl/
├── backend/                    ← FastAPI Python server
│   ├── main.py                 ← App entry point
│   ├── schemas.py              ← Pydantic input/output models
│   ├── models_loader.py        ← Loads all .pkl files at startup
│   ├── routers/
│   │   ├── predict.py          ← POST /api/predict
│   │   ├── explain.py          ← POST /api/explain (SHAP)
│   │   ├── cluster.py          ← POST /api/cluster (K-Means)
│   │   ├── simulate.py         ← POST /api/simulate (what-if)
│   │   ├── solar.py            ← POST /api/solar (ROI)
│   │   ├── history.py          ← GET/POST /api/history
│   │   └── health.py           ← GET /api/health
│   ├── models/                 ← .pkl model files (gitignored)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                   ← React.js web application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.js  ← Hero landing page
│   │   │   ├── AppPage.js      ← Calculate page
│   │   │   ├── ResultsPage.js  ← Dashboard results
│   │   │   ├── SolarPage.js    ← Solar ROI calculator
│   │   │   └── HistoryPage.js  ← Emission history tracker
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ApplianceForm.js
│   │   │   ├── SummaryCards.js
│   │   │   ├── ShapChart.js
│   │   │   ├── ClusterCard.js
│   │   │   ├── WhatIfSimulator.js
│   │   │   ├── EmissionGauge.js
│   │   │   ├── TrendChart.js
│   │   │   ├── Loader.js
│   │   │   └── EmptyState.js
│   │   ├── App.js
│   │   ├── api.js
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── ml/                         ← Training pipeline (Google Colab / local)
│   ├── scripts/
│   │   ├── data_loader.py
│   │   ├── feature_engineering.py
│   │   ├── train_xgboost.py
│   │   ├── train_kmeans.py
│   │   ├── train_shap.py
│   │   └── evaluate.py
│   ├── data/                   ← CSV datasets (gitignored for large files)
│   ├── models/                 ← Trained .pkl files (gitignored)
│   └── requirements.txt
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20 LTS
- Docker Desktop

### 1 — Clone the repository
```bash
git clone https://github.com/madhukavirajith/CarbonWiseSL.git
cd CarbonWiseSL
```

### 2 — Train the ML models
```bash
cd ml
pip install -r requirements.txt

# Put your CSV dataset in ml/data/
# Then run training scripts in order:
cd scripts
python train_xgboost.py
python train_kmeans.py
python train_shap.py
python evaluate.py        # verify everything works

# Copy models to backend
cp ../models/*.pkl ../../backend/models/
```

### 3 — Start the backend
```bash
cd ../../backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
cp .env.example .env

uvicorn main:app --reload --port 8000
# Visit http://localhost:8000/docs
```

### 4 — Start the frontend
```bash
cd ../frontend
cp .env.example .env
npm install
npm start
# Visit http://localhost:3000
```

### 5 — Or run everything with Docker Compose
```bash
cd carbonwise-sl
docker compose up --build
# Backend  → http://localhost:8000/docs
# Frontend → http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check — model status |
| POST | `/api/predict` | XGBoost CO₂ prediction |
| POST | `/api/explain` | SHAP appliance breakdown |
| POST | `/api/cluster` | K-Means household profile |
| POST | `/api/simulate` | What-if scenario simulation |
| POST | `/api/solar` | Solar ROI calculation |
| POST | `/api/history/save` | Save prediction to history |
| GET | `/api/history/{user_id}` | Retrieve emission history |

Full interactive API documentation at: `http://localhost:8000/docs`

---

## Deployment

### Backend → Render.com
1. Push code to GitHub
2. Go to render.com → New Web Service → Connect GitHub repo
3. Root Directory: `backend` · Environment: Docker · Instance: Free
4. Add environment variable: `ALLOWED_ORIGINS=https://carbon-wise-sl.vercel.app/`
5. Deploy

### Frontend → Vercel
1. Go to vercel.com → Add New Project → Import GitHub repo
2. Root Directory: `frontend` · Framework: Create React App
3. Add environment variable: `REACT_APP_API_URL=https://carbonwise-backend.onrender.com/`
4. Deploy

Every `git push` to GitHub triggers automatic redeployment on both platforms.

---

## Data Sources

| Source | Used For |
|--------|---------|
| SLSEA Grid Emission Factor 2024 | CO₂ per kWh conversion (0.52 kg/kWh) |
| CEB Domestic Tariff 2024 | 5-tier progressive bill calculation |
| SLSEA Solar Irradiance Tables | City-level solar generation (Colombo/Kandy/Galle) |
| IEA Emissions Factors 2024 | Cross-validation |
| UCI Household Electric Power Consumption | XGBoost pre-training |
| Sri Lankan Appliance Survey (self-collected) | Local model calibration |

---

## AI Models

| Model | Type | Task | Performance Target |
|-------|------|------|-------------------|
| XGBoost | Regression | Predict daily CO₂ (kg) | R² ≥ 0.85, MAE ≤ 0.10 |
| SHAP TreeExplainer | Explainability | Per-appliance CO₂ attribution | Exact (not approximate) |
| K-Means | Clustering | Household behaviour profiling | Silhouette score > 0.30 |

---

## Academic Context

- **Module**: CIS6035 Software Engineering Development Project
- **Institution**: BSc (Hons) Computer Science
- **Student**: Kuruppu Arachchige Madhuka Virajith (St20311741)
- **Architecture**: Train/Production separation as prescribed by module
- **Methodology**: Agile Scrum — 8 two-week sprints (April 25 – August 10 2025)

---

## License

MIT License — open source for research and educational use.