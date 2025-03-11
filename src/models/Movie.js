import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 100, unique: true },
  year_of_release: { type: Number, required: true, min: 1900, max: 2025 },
  plot: { type: String, maxLength: 1000 },
  poster: String,
  producer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer', required: true },
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
});

export default mongoose.model('Movie', movieSchema);