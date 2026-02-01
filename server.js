const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const blogRoutes = require("./src/routes/blogRoutes");

const app = express();

// Middleware to read JSON
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", blogRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// Health route (simple)
app.get('/', (req, res) => res.send('OK'));

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server PID:', process.pid);
});

// Error handlers for visibility
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
