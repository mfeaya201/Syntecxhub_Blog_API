const BlogPost = require("../models/BlogPost");
const mongoose = require("mongoose");

// Create a new blog post function
const createPost = async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const post = await BlogPost.create({
      title,
      body,
      tags,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog post", error: error.message });
  }
};

// List posts with pagination, filtering and sorting
const listPosts = async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = Math.max(parseInt(req.query.skip) || 0, 0);
    const { tag, author, from, to, sort } = req.query;

    const filter = {};

    if (tag) {
      filter.tags = { $in: [tag.toLowerCase()] };
    }

    if (author) {
      if (mongoose.Types.ObjectId.isValid(author)) {
        filter.author = author;
      } else {
        return res.status(400).json({ message: "Invalid author id" });
      }
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) {
        const fromDate = new Date(from);
        if (!isNaN(fromDate)) filter.createdAt.$gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        if (!isNaN(toDate)) filter.createdAt.$lte = toDate;
      }
      // remove if empty
      if (Object.keys(filter.createdAt).length === 0) delete filter.createdAt;
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const total = await BlogPost.countDocuments(filter);

    const posts = await BlogPost.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email");

    res.json({ total, limit, skip, posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to list posts", error: error.message });
  }
};

// Get single post by id
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await BlogPost.findById(id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to get post", error: error.message });
  }
};

// Update post (only author)
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await BlogPost.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Authorization: only author can update
    if (!req.user || post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    const { title, body, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;
    if (tags !== undefined) post.tags = tags;

    await post.save();
    const updated = await BlogPost.findById(id).populate("author", "name email");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
};

// Delete post (only author)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await BlogPost.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!req.user || post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.remove();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

module.exports = {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost,
};