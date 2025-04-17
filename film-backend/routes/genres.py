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
def get_all_genres():
    genres = genres_collection.find()
    return parse_json(genres)

@router.get("/{genre_id}")
def get_genre_by_id(genre_id: int):
    genre = genres_collection.find_one({"_id": genre_id})
    if not genre:
        raise HTTPException(status_code=404, detail="Genre non trouvé")
    return parse_json(genre)

@router.get("/stats")
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

@router.get("/top5")
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