const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// API health check
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Blogify API is running"
    });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// API 404 handler
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// MongoDB connection
let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;

    console.log("MongoDB Connected:", mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);
}

// Vercel serverless handler
module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error("Database connection error:", error);

        return res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
};

// Local development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Blogify server running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error("MongoDB connection error:", error.message);
            process.exit(1);
        });
}