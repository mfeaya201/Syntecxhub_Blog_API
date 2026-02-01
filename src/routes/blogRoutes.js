const express = require("express");
const router = express.Router();

// Import controllers
const {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/blogController");

// Import middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Create a post (protected)
router.post("/", authMiddleware, createPost);

// List posts with pagination, filtering and sorting (public)
router.get("/", listPosts);

// Get single post by id (public)
router.get("/:id", getPostById);

// Update post (protected, only author)
router.put("/:id", authMiddleware, updatePost);

// Delete post (protected, only author)
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
