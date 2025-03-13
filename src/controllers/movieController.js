import Movie from "../models/Movie.js";
import Actor from "../models/Actor.js";
import Producer from "../models/Producer.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Multer configuration for file uploads (using /tmp for Vercel)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "/tmp"), // Vercel writable directory
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage }).single("poster");

// Add a Movie
export const addMovie = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const { name, year_of_release, plot, producer, actors } = req.body;
    let posterUrl = "";
    const filePath = req.file ? req.file.path : null;

    try {
      if (
        !name ||
        !year_of_release ||
        !producer ||
        !actors ||
        !Array.isArray(JSON.parse(actors)) ||
        JSON.parse(actors).length === 0
      ) {
        return res
          .status(400)
          .json({ error: "All required fields must be provided" });
      }

      if (req.file) {
        const uploadResult = await uploadOnCloudinary(filePath);
        if (!uploadResult) {
          throw new Error("Failed to upload poster to Cloudinary");
        }
        posterUrl = uploadResult.secure_url;
      }

      let producerId;
      const producerData = JSON.parse(producer);
      if (producerData._id) {
        const existingProducer = await Producer.findById(producerData._id);
        if (!existingProducer)
          return res.status(404).json({ error: "Producer not found" });
        producerId = existingProducer._id;
      } else {
        const newProducer = new Producer(producerData);
        const savedProducer = await newProducer.save();
        producerId = savedProducer._id;
      }

      const actorIds = [];
      for (const actor of JSON.parse(actors)) {
        if (actor._id) {
          const existingActor = await Actor.findById(actor._id);
          if (!existingActor)
            return res
              .status(404)
              .json({ error: `Actor with ID ${actor._id} not found` });
          actorIds.push(existingActor._id);
        } else {
          const newActor = new Actor(actor);
          const savedActor = await newActor.save();
          actorIds.push(savedActor._id);
        }
      }

      const movie = new Movie({
        name,
        year_of_release,
        plot,
        poster: posterUrl,
        producer_id: producerId,
        actors: actorIds,
      });
      const savedMovie = await movie.save();
      const populatedMovie = await Movie.findById(savedMovie._id)
        .populate("producer_id")
        .populate("actors");

      res.status(201).json(populatedMovie);
    } catch (err) {
      console.error("Error in addMovie:", err);
      res.status(500).json({ error: err.message });
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Clean up temporary file
      }
    }
  });
};

// Get All Movies
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .populate("producer_id")
      .populate("actors");
    res.json({ movies });
  } catch (err) {
    console.error("Error in getMovies:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update a Movie
export const updateMovie = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const { id } = req.params;
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const filePath = req.file ? req.file.path : null;

    if (req.file && !fs.existsSync(filePath)) {
      console.error("File not found after multer:", filePath);
    }

    const { name, year_of_release, plot } = req.body;
    const producer = req.body.producer ? JSON.parse(req.body.producer) : null;
    const actors = req.body.actors ? JSON.parse(req.body.actors) : null;

    try {
      const updateData = { name, year_of_release, plot };

      if (req.file) {
        const uploadResult = await uploadOnCloudinary(filePath);
        if (!uploadResult) {
          throw new Error("Failed to upload poster to Cloudinary");
        }
        updateData.poster = uploadResult.secure_url;
      } else {
        const existingMovie = await Movie.findById(id);
        if (!existingMovie)
          return res.status(404).json({ error: "Movie not found" });
        updateData.poster = existingMovie.poster;
      }

      if (producer?._id) {
        const existingProducer = await Producer.findById(producer._id);
        if (!existingProducer)
          return res.status(404).json({ error: "Producer not found" });
        updateData.producer_id = existingProducer._id;
      } else if (producer) {
        const newProducer = new Producer(producer);
        const savedProducer = await newProducer.save();
        updateData.producer_id = savedProducer._id;
      }

      if (actors && Array.isArray(actors)) {
        const actorIds = [];
        for (const actor of actors) {
          if (actor._id) {
            const existingActor = await Actor.findById(actor._id);
            if (!existingActor)
              return res
                .status(404)
                .json({ error: `Actor with ID ${actor._id} not found` });
            actorIds.push(existingActor._id);
          } else {
            const newActor = new Actor(actor);
            const savedActor = await newActor.save();
            actorIds.push(savedActor._id);
          }
        }
        updateData.actors = actorIds;
      }

      const movie = await Movie.findByIdAndUpdate(id, updateData, { new: true })
        .populate("producer_id")
        .populate("actors");

      if (!movie) return res.status(404).json({ error: "Movie not found" });
      res.json(movie);
    } catch (err) {
      console.error("Error in updateMovie:", err);
      res.status(500).json({ error: err.message });
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Clean up temporary file
      }
    }
  });
};

// Delete a Movie
export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("Error in deleteMovie:", err);
    res.status(500).json({ error: err.message });
  }
};