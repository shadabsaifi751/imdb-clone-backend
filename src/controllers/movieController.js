import Movie from "../models/Movie.js";
import Actor from "../models/Actor.js";
import Producer from "../models/Producer.js";

// ✅ Get All Movies (Return All Fields)
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

// ✅ Add a Movie (Return Full Data)
export const addMovie = async (req, res) => {
  const { name, year_of_release, plot, poster, producer, actors } = req.body;

  try {
    if (!name || !year_of_release || !producer || !actors || !Array.isArray(actors) || actors.length === 0) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    let producerId;
    if (producer._id) {
      const existingProducer = await Producer.findById(producer._id);
      if (!existingProducer) return res.status(404).json({ error: "Producer not found" });
      producerId = existingProducer._id;
    } else {
      const newProducer = new Producer(producer);
      const savedProducer = await newProducer.save();
      producerId = savedProducer._id;
    }

    const actorIds = [];
    for (const actor of actors) {
      if (actor._id) {
        const existingActor = await Actor.findById(actor._id);
        if (!existingActor) return res.status(404).json({ error: `Actor with ID ${actor._id} not found` });
        actorIds.push(existingActor._id);
      } else {
        const newActor = new Actor(actor);
        const savedActor = await newActor.save();
        actorIds.push(savedActor._id);
      }
    }

    const movie = new Movie({ name, year_of_release, plot, poster, producer_id: producerId, actors: actorIds });
    const savedMovie = await movie.save();
    const populatedMovie = await Movie.findById(savedMovie._id).populate("producer_id").populate("actors");
    res.status(201).json(populatedMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a Movie (Return Full Data)
export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { name, year_of_release, plot, poster, producer, actors } = req.body;

  try {
    const updateData = { name, year_of_release, plot, poster };

    if (producer?._id) {
      const existingProducer = await Producer.findById(producer._id);
      if (!existingProducer) return res.status(404).json({ error: "Producer not found" });
      updateData.producer_id = existingProducer._id;
    }

    if (actors && Array.isArray(actors)) {
      const actorIds = [];
      for (const actor of actors) {
        if (actor._id) {
          const existingActor = await Actor.findById(actor._id);
          if (!existingActor) return res.status(404).json({ error: `Actor with ID ${actor._id} not found` });
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
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a Movie
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
