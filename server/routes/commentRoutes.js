const express = require("express");

const {
    createComment,
    getComments,
    deleteComment
} = require("../controllers/commentController");

const auth = require("../middleware/auth");

const router = express.Router();

// Get all comments for a post
router.get("/:postId", getComments);

// Create a comment
router.post("/:postId", auth, createComment);

// Delete your own comment
router.delete("/:id", auth, deleteComment);

module.exports = router;