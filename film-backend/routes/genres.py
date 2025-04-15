from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from bson.json_util import dumps
from db.mongo import films_collection, genres_collection
import json
from typing import Optional

router = APIRouter()

@router.get("/genres/")
def get_all_genres():
    genres = genres_collection.find()
    return parse_json(genres)

@router.get("/genres/{genre_id}")
def get_genre_by_id(genre_id: int):
    genre = genres_collection.find_one({"_id": genre_id})
    if not genre:
        raise HTTPException(status_code=404, detail="Genre non trouvé")
    return parse_json(genre)