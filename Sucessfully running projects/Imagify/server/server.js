import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoutes.js';
import connectDB from './configs/mongodb.js';
import imageRouter from './routes/imageRoutes.js';

// Fix "__dirname" in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App Config
const PORT = process.env.PORT || 4000;
const app = express();
await connectDB();

// Initialize Middlewares
app.use(express.json());
app.use(cors());

// API routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

// Serve static frontend files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Catch-all route to serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => console.log('Server running on port ' + PORT));
