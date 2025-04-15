import os
import requests
from pymongo import MongoClient
from dotenv import load_dotenv
import time

load_dotenv()
API_KEY = os.getenv("TMDB_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["films_db"]
collection = db["films"]

def fetch_movies():
    for page in range(1, 50):
        url = f"https://api.themoviedb.org/3/discover/movie"
        params = {
            "api_key": API_KEY,
            "language": "fr-FR",
            "page": page,
            "sort_by": "popularity.desc"
        }

        try:
            response = requests.get(url, params=params)
            data = response.json()

            for film in data.get("results", []):
                film["_id"] = film["id"]
                collection.update_one(
                    {"_id": film["_id"]},
                    {"$set": film},
                    upsert=True
                )

            print(f"✅ Page {page} terminée ({len(data.get('results', []))} films)")
            time.sleep(0.5)

        except Exception as e:
            print(f"❌ Erreur page {page} : {e}")
            time.sleep(5)

fetch_movies()
