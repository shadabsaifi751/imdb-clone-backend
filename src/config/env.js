// /* eslint-disable no-undef */
// import { config } from "dotenv";

// // dotenv.config(); // This loads the .env file
// config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

// export const { PORT, NODE_ENV, DB_URL } = process.env;

import dotenv from "dotenv";

// Ensure correct .env file is loaded based on NODE_ENV
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRETKEY,
} = process.env;
