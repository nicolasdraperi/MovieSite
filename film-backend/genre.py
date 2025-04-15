import os
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("TMDB_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["films_db"]
genre_collection = db["genres"]
def fetch_genres():
    url = "https://api.themoviedb.org/3/genre/movie/list"
    params = {
        "api_key": API_KEY,
        "language": "fr-FR"
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()

        genres = data.get("genres", [])
        for genre in genres:
            genre["_id"] = genre["id"]
            genre_collection.update_one(
                {"_id": genre["_id"]},
                {"$set": genre},
                upsert=True
            )

        print(f"✅ {len(genres)} genres enregistrés")

    except Exception as e:
        print(f"❌ Erreur récupération genres : {e}")

# Lancer
fetch_genres()