const Post = require("../models/Post");

// @desc    Create a new post
// @route   POST /api/posts
const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const post = await Post.create({
            title,
            content,
            author: req.user.id
        });

        const populatedPost = await Post.findById(post._id)
            .populate("author", "name email");

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: populatedPost
        });

    } catch (error) {
        console.error("Create post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: posts.length,
            posts
        });

    } catch (error) {
        console.error("Get posts error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.json({
            success: true,
            post
        });

    } catch (error) {
        console.error("Get post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own posts"
            });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate("author", "name email");

        res.json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost
        });

    } catch (error) {
        console.error("Update post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts"
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error("Delete post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
};