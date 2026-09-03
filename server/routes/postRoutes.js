const express = require("express");

const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
} = require("../controllers/postController");

const auth = require("../middleware/auth");

const router = express.Router();

// Get all posts
router.get("/", getPosts);

// Get one post
router.get("/:id", getPost);

// Create post - login required
router.post("/", auth, createPost);

// Update post - login required
router.put("/:id", auth, updatePost);

// Delete post - login required
router.delete("/:id", auth, deletePost);

module.exports = router;