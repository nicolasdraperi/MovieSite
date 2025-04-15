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
@router.get("/{film_id}")
def get_film_by_id(film_id: int):
    film = films_collection.find_one({"_id": film_id})
    if not film:
        raise HTTPException(status_code=404, detail="Film non trouvé")
    return parse_json(film)

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
