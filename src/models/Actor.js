import mongoose from 'mongoose';

const actorSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 100 },
  gender: { type: String, enum: ['M', 'F', 'Other'], required: true },
  dob: { type: Date, required: true, validate: v => v < new Date('2025-03-11') },
  bio: { type: String, maxLength: 1000 },
});

export default mongoose.model('Actor', actorSchema);