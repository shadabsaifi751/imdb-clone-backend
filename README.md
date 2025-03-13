# IMDb Clone Backend

This is the backend for the IMDb Clone application, built with Node.js, Express.js, MongoDB, and Cloudinary for file uploads. It provides RESTful APIs for managing movies, actors, and producers, and is deployed as a serverless function on Vercel.

## Features
- CRUD operations for movies, actors, and producers.
- File upload support for movie posters using Cloudinary.
- MongoDB integration for persistent storage.
- CORS-enabled for frontend communication.

## Tech Stack
- **Node.js**: Runtime environment.
- **Express.js**: Web framework.
- **MongoDB**: Database (via Mongoose).
- **Multer**: File upload handling.
- **Cloudinary**: Cloud storage for images.
- **Vercel**: Serverless deployment platform.


## Prerequisites
- Node.js (v18.x recommended)
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account
- Vercel CLI (`npm install -g vercel`)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/imdb-clone.git
cd imdb-clone/backend

## Install Dependencies

npm install

4. Run Locally
npm run dev

API Endpoints
Movies
POST /api/v1/movies - Add a movie
GET /api/v1/movies - Get all movies
PUT /api/v1/movies/:id - Update a movie
DELETE /api/v1/movies/:id - Delete a movie
Actors (similar CRUD endpoints)
Producers (similar CRUD endpoints)
