import express from "express";
import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage }).single("poster");

const router = express.Router();

router.get("/", getMovies);
router.post("/", authenticateToken, addMovie);
router.put("/:id", authenticateToken, upload, updateMovie);
router.delete("/:id", authenticateToken, deleteMovie);

export default router;
