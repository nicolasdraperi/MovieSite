from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.films import router as film_router
from routes.genres import router as genre_router

app = FastAPI(title="TMDb Mongo API")

# CORS pour front-end externe (optionnel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes depuis /routes
app.include_router(film_router, prefix="/films", tags=["Films"])
app.include_router(genre_router, prefix="/genres", tags=["Genres"])
