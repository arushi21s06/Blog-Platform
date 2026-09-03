const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Create a comment
const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { postId } = req.params;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = await Comment.create({
            content: content.trim(),
            author: req.user.id,
            post: postId
        });

        await comment.populate("author", "name email");

        res.status(201).json({
            success: true,
            comment
        });

    } catch (error) {
        console.error("Create comment error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Get comments for a post
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ post: postId })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            comments
        });

    } catch (error) {
        console.error("Get comments error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Delete your own comment
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own comments"
            });
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("Delete comment error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createComment,
    getComments,
    deleteComment
};