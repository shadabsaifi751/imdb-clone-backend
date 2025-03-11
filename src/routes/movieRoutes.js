import express from 'express';
import { getMovies, addMovie, updateMovie, deleteMovie } from '../controllers/movieController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, getMovies);
router.post('/', authenticateToken, addMovie);
router.put('/:id', authenticateToken, updateMovie);
router.delete('/:id', authenticateToken, deleteMovie);

export default router;