from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from bson.json_util import dumps
from db.mongo import films_collection, genres_collection
import json
from typing import Optional
router = APIRouter()

def parse_json(data):
    return json.loads(dumps(data))
@router.get("/")
def get_all_films(skip: int = 0, limit: int = 50):
    films = films_collection.find().skip(skip).limit(limit)
    return parse_json(films)

@router.get("/genres/stats")
def get_all_genres_with_counts():
    pipeline = [
        {"$unwind": "$genre_ids"},
        {"$group": {"_id": "$genre_ids", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    genre_counts = list(films_collection.aggregate(pipeline))
    genres = list(genres_collection.find())
    genre_lookup = {g["id"]: g["name"] for g in genres}
    for g in genre_counts:
        g["name"] = genre_lookup.get(g["_id"], "Inconnu")
    return parse_json(genre_counts)

@router.get("/genres/top5")
def get_top_5_genres():
    pipeline = [
        {"$unwind": "$genre_ids"},
        {"$group": {"_id": "$genre_ids", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    top_genres = list(films_collection.aggregate(pipeline))
    genre_ids = [g["_id"] for g in top_genres]
    genres = list(genres_collection.find({"id": {"$in": genre_ids}}))
    genre_lookup = {g["id"]: g["name"] for g in genres}
    for g in top_genres:
        g["name"] = genre_lookup.get(g["_id"], "Inconnu")
    return parse_json(top_genres)

@router.post("/")
def add_film(film: dict):
    film["_id"] = film["id"]
    result = films_collection.insert_one(film)
    return {"message": "Film ajouté", "id": str(result.inserted_id)}

@router.put("/{film_id}")
def update_film(film_id: int, film: dict):
    result = films_collection.update_one({"_id": film_id}, {"$set": film})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Film non trouvé")
    return {"message": "Film modifié"}

@router.delete("/{film_id}")
def delete_film(film_id: int):
    result = films_collection.delete_one({"_id": film_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Film non trouvé")
    return {"message": "Film supprimé"}

@router.get("/search")
def search_films(
    title: Optional[str] = Query(None),
    genre_id: Optional[int] = Query(None),
    min_rating: Optional[float] = Query(None),
    max_rating: Optional[float] = Query(None)
):
    query = {}
    if title:
        query["title"] = {"$regex": title, "$options": "i"}
    if genre_id:
        query["genre_ids"] = genre_id
    if min_rating or max_rating:
        query["vote_average"] = {}
        if min_rating:
            query["vote_average"]["$gte"] = min_rating
        if max_rating:
            query["vote_average"]["$lte"] = max_rating

    films = films_collection.find(query)
    return parse_json(films)
@router.get("/count")
def get_total_films():
    total = films_collection.count_documents({})
    return {"total_films": total}

@router.get("/oldest")
def get_oldest_film():
    film = films_collection.find_one(sort=[("release_date", 1)])
    if not film:
        raise HTTPException(status_code=404, detail="Aucun film trouvé")
    return parse_json(film)

@router.get("/newest")
def get_newest_film():
    film = films_collection.find_one(sort=[("release_date", -1)])
    if not film:
        raise HTTPException(status_code=404, detail="Aucun film trouvé")
    return parse_json(film)


@router.get("/top")
def get_top_films():
    films = films_collection.find(
        {
            "vote_average": {"$ne": 0},
            "vote_count": {"$gte": 500}
        }
    ).sort("vote_average", -1).limit(10)

    return parse_json(films)


@router.get("/average-rating")
def get_average_rating():
    pipeline = [
        {"$match": {"vote_average": {"$ne": 0}}},
        {"$group": {
            "_id": None,
            "average_rating": {"$avg": "$vote_average"}
        }}
    ]
    result = list(films_collection.aggregate(pipeline))

    if not result:
        raise HTTPException(status_code=404, detail="Pas de données pour la moyenne")

    return {"average_rating": round(result[0]["average_rating"], 2)}

from pydantic import BaseModel

class GenreRequest(BaseModel):
    genre_id: int

@router.post("/top-by-genre")
def get_top_films_by_genre(payload: GenreRequest):
    genre_id = payload.genre_id

    films = films_collection.find(
        {
            "vote_average": {"$ne": 0},
            "vote_count": {"$gte": 25},
            "genre_ids": genre_id
        }
    ).sort("vote_average", -1).limit(5)

    return parse_json(films)

@router.get("/{film_id}")
def get_film_by_id(film_id: int):
    film = films_collection.find_one({"_id": film_id})
    if not film:
        raise HTTPException(status_code=404, detail="Film non trouvé")
    return parse_json(film)

@router.post("/by-genre")
def get_films_by_genre(payload: GenreRequest):
    genre_id = payload.genre_id

    films = films_collection.find(
        {"genre_ids": genre_id}
    ).sort([
        ("vote_average", -1),
        ("vote_count", -1)
    ])

    return parse_json(films)
