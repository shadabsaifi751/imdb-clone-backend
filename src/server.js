import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import connectDB from "./database/mongodb.js";
import { PORT } from "./config/env.js";

const app = express();

// Connect to MongoDB

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", movieRoutes);

// const PORT = PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, async () => {
  console.log(`Backend is ready: http://localhost:${PORT}`);

  await connectDB();
});
