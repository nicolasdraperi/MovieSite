# 🎬 MovieSite

**MovieSite** est une application moderne de découverte de films, construite avec **Next.js** et **FastAPI**. Elle permet d'explorer des films populaires, de faire des recherches, et de profiter d'une interface fluide et responsive.

---

## 🛠 Technologies Utilisées

### Front-end

- **Next.js 14** – Framework React
- **TypeScript** – Typage statique
- **Tailwind CSS** – Framework CSS utilitaire
- **Shadcn/ui** – Composants UI modernes
- **Framer Motion** – Animations fluides

### Back-end

- **FastAPI** – Framework Python performant
- **MongoDB** – Base de données NoSQL
- **Python 3.11+** – Langage back-end

---

## 🚀 Installation

### Prérequis

- Node.js ≥ 18
- Python ≥ 3.11
- MongoDB

### Cloner le projet

```bash
git clone https://github.com/nicolasdraperi/MovieSite.git
cd MovieSite
```

### Configuration Backend

```bash
# Créer et activer l'environnement virtuel
python -m venv venv
# Windows
.\venv\Scripts\activate
# Unix/MacOS
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer le .env
MONGODB_URI=votre_uri_mongodb
API_KEY=votre_clé_api_tmdb
```
### Configuration Frontend

```bash
cd moviefront
npm install

# Configurer le .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Lancer le projet

```bash
# Backend (depuis MovieSite/)
uvicorn main:app --reload
# Frontend (depuis moviefront/)
npm run dev
```
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## 📍 Routes Disponibles

### 🎬 API Films

| Route | Description | Méthode |
|-------|-------------|-------------|
| `/api/films` | Liste des films | GET |
| `/api/films/{film_id}` | Détails d'un film |GET |
| `/api/films/search` | Recherche de films |GET |
| `/api/genres` | Liste des genres |GET |
| `/api/films/genre/{genre_id}` | Films par genre |GET |

###  📱 Pages Frontend

| Route | Description | 
|-------|-------------|
| `/` | Liste des films | 
| `/film/[id]` | Détails d'un film |

## 📦 Modèles de Données
### 🎥 Film
```bash
interface Film {
  _id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  release_date: string;
  runtime?: number;
  genres?: Array<{
    id: number;
    name: string;
  }>;
}
```

### 🏷️ Genre

```bash
interface Genre {
  id: number;
  name: string;
}
```

## 🎯 Fonctionnalités

### 🎬 Films
- Affichage des films populaires
- Recherche en temps réel
- Design responsive
- Filtrage par genre

### 🎨 Interface

- Mode sombre/clair
- Animations fluides
- Adaptation mobile
