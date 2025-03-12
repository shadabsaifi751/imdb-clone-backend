import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import connectDB from "./database/mongodb.js";
import { PORT } from "./config/env.js";
import cors from 'cors';

const app = express();

// Define allowed origins
const allowedOrigins = [
  'https://imdb-clone-frontend-beta.vercel.app', // Production frontend
  'http://localhost:5173',                       // Local development frontend
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the incoming origin is in the allowedOrigins list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'],    // Allow these headers
  credentials: true,                                    // Allow cookies or auth headers if needed
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", movieRoutes);

// Handle preflight requests for all routes
app.options('*', cors());
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, async () => {
  console.log(`Backend is ready: http://localhost:${PORT}`);

  await connectDB();
});

export default app;
