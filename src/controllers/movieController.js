// import Movie from "../models/Movie.js";
// import Actor from "../models/Actor.js";
// import Producer from "../models/Producer.js";
// import multer from "multer";
// import path from "path"; // Import path module
// import fs from "fs";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";

// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadDir = path.join(__dirname, "uploads");

// // Ensure uploads directory exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) =>
//     cb(null, `${Date.now()}${path.extname(file.originalname)}`),
// });
// const upload = multer({ storage }).single("poster");
// // // Ensure uploads directory exists
// // if (!fs.existsSync("uploads/")) {
// //   fs.mkdirSync("uploads/");
// // }

// // // Configure Multer for file uploads
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, "uploads/"), // Temporary folder
// //   filename: (req, file, cb) =>
// //     cb(null, Date.now() + path.extname(file.originalname)), // Use path.extname
// // });
// // const upload = multer({ storage }).single("poster"); // 'poster' is the field name from frontend

// // Add a Movie (Return Full Data)
// export const addMovie = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const { name, year_of_release, plot, producer, actors } = req.body;
//     let posterUrl = "";

//     try {
//       if (
//         !name ||
//         !year_of_release ||
//         !producer ||
//         !actors ||
//         !Array.isArray(JSON.parse(actors)) ||
//         JSON.parse(actors).length === 0
//       ) {
//         return res
//           .status(400)
//           .json({ error: "All required fields must be provided" });
//       }

//       // Handle poster upload to Cloudinary if a file is provided
//       if (req.file) {
//         const uploadResult = await uploadOnCloudinary(req.file.path);
//         if (!uploadResult)
//           return res
//             .status(500)
//             .json({ error: "Failed to upload poster to Cloudinary" });
//         posterUrl = uploadResult.secure_url;
//       }

//       let producerId;
//       const producerData = JSON.parse(producer); // Parse producer from string
//       if (producerData._id) {
//         const existingProducer = await Producer.findById(producerData._id);
//         if (!existingProducer)
//           return res.status(404).json({ error: "Producer not found" });
//         producerId = existingProducer._id;
//       } else {
//         const newProducer = new Producer(producerData);
//         const savedProducer = await newProducer.save();
//         producerId = savedProducer._id;
//       }

//       const actorIds = [];
//       for (const actor of JSON.parse(actors)) {
//         // Parse actors from string
//         if (actor._id) {
//           const existingActor = await Actor.findById(actor._id);
//           if (!existingActor)
//             return res
//               .status(404)
//               .json({ error: `Actor with ID ${actor._id} not found` });
//           actorIds.push(existingActor._id);
//         } else {
//           const newActor = new Actor(actor);
//           const savedActor = await newActor.save();
//           actorIds.push(savedActor._id);
//         }
//       }

//       const movie = new Movie({
//         name,
//         year_of_release,
//         plot,
//         poster: posterUrl,
//         producer_id: producerId,
//         actors: actorIds,
//       });
//       const savedMovie = await movie.save();
//       const populatedMovie = await Movie.findById(savedMovie._id)
//         .populate("producer_id")
//         .populate("actors");
//       res.status(201).json(populatedMovie);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
// };
// // Get All Movies (Return All Fields)
// export const getMovies = async (req, res) => {
//   try {
//     const movies = await Movie.find()
//       .populate("producer_id")
//       .populate("actors");

//     res.json({ movies });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Update a Movie (Return Full Data)
// export const updateMovie = async (req, res) => {
//   const { id } = req.params;
//   console.log("req.body:", req.body); // Debug incoming data
//   console.log("req.file:", req.file); // Debug uploaded file

//   // Parse JSON fields manually since they're strings in FormData
//   const { name, year_of_release, plot } = req.body;
//   const producer = req.body.producer ? JSON.parse(req.body.producer) : null;
//   const actors = req.body.actors ? JSON.parse(req.body.actors) : null;

//   try {
//     const updateData = { name, year_of_release, plot };

//     // Handle poster upload to Cloudinary if a file is provided
//     if (req.file) {
//       const uploadResult = await uploadOnCloudinary(req.file.path);
//       if (!uploadResult)
//         return res
//           .status(500)
//           .json({ error: "Failed to upload poster to Cloudinary" });
//       updateData.poster = uploadResult.secure_url; // Use Cloudinary URL
//     } else {
//       // If no new poster, retain the existing one (optional)
//       const existingMovie = await Movie.findById(id);
//       if (!existingMovie)
//         return res.status(404).json({ error: "Movie not found" });
//       updateData.poster = existingMovie.poster; // Preserve existing poster
//     }

//     if (producer?._id) {
//       const existingProducer = await Producer.findById(producer._id);
//       if (!existingProducer)
//         return res.status(404).json({ error: "Producer not found" });
//       updateData.producer_id = existingProducer._id;
//     } else if (producer) {
//       const newProducer = new Producer(producer);
//       const savedProducer = await newProducer.save();
//       updateData.producer_id = savedProducer._id;
//     }

//     if (actors && Array.isArray(actors)) {
//       const actorIds = [];
//       for (const actor of actors) {
//         if (actor._id) {
//           const existingActor = await Actor.findById(actor._id);
//           if (!existingActor)
//             return res
//               .status(404)
//               .json({ error: `Actor with ID ${actor._id} not found` });
//           actorIds.push(existingActor._id);
//         } else {
//           const newActor = new Actor(actor);
//           const savedActor = await newActor.save();
//           actorIds.push(savedActor._id);
//         }
//       }
//       updateData.actors = actorIds;
//     }

//     console.log("updateData:", updateData); // Debug update payload
//     const movie = await Movie.findByIdAndUpdate(id, updateData, { new: true })
//       .populate("producer_id")
//       .populate("actors");

//     if (!movie) return res.status(404).json({ error: "Movie not found" });
//     res.json(movie);
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Delete a Movie
// export const deleteMovie = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const movie = await Movie.findByIdAndDelete(id);
//     if (!movie) return res.status(404).json({ error: "Movie not found" });
//     res.status(200).json({ message: "Movie deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import Movie from "../models/Movie.js";
import Actor from "../models/Actor.js";
import Producer from "../models/Producer.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage }).single("poster");

// Add a Movie
export const addMovie = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    console.log("req.file:", req.file);
    if (req.file && !fs.existsSync(req.file.path)) {
      console.error("File not found after multer:", req.file.path);
    }

    const { name, year_of_release, plot, producer, actors } = req.body;
    let posterUrl = "";

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
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult)
          return res
            .status(500)
            .json({ error: "Failed to upload poster to Cloudinary" });
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
      res.status(500).json({ error: err.message });
    }
  });
};

// Update a Movie
export const updateMovie = async (req, res) => {
  const { id } = req.params;
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  if (req.file && !fs.existsSync(req.file.path)) {
    console.error("File not found after multer:", req.file.path);
  }

  const { name, year_of_release, plot } = req.body;
  const producer = req.body.producer ? JSON.parse(req.body.producer) : null;
  const actors = req.body.actors ? JSON.parse(req.body.actors) : null;

  try {
    const updateData = { name, year_of_release, plot };

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult)
        return res
          .status(500)
          .json({ error: "Failed to upload poster to Cloudinary" });
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
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Movies and Delete Movie remain unchanged
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .populate("producer_id")
      .populate("actors");
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
