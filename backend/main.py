# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, explain, cluster, simulate, solar

app = FastAPI(
    title='CarbonWise SL API',
    description='AI-powered household electricity carbon prediction for Sri Lanka',
    version='1.0.0'
)

# CORS — allows your React frontend to call this API
# During development: allow all. In production: restrict to your Vercel URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://carbon-wise-sl.vercel.app/'],  # Change to ['https://your-app.vercel.app'] in production
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Register all routers under /api prefix
app.include_router(predict.router, prefix='/api', tags=['Prediction'])
app.include_router(explain.router, prefix='/api', tags=['Explainability'])
app.include_router(cluster.router, prefix='/api', tags=['Clustering'])
app.include_router(simulate.router, prefix='/api', tags=['Simulation'])
app.include_router(solar.router, prefix='/api', tags=['Solar ROI'])

@app.get('/')
def root():
    return {'message': 'CarbonWise SL API is running', 'docs': '/docs'}

@app.get('/health')
def health():
    return {'status': 'healthy'}
