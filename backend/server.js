require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
    console.warn(`WARNING: Missing required environment variable(s): ${missingEnvVars.join(", ")}`);
}

const app = express();

const clientUrl = process.env.CLIENT_URL;
app.use(cors({
    origin: clientUrl ? [clientUrl, "http://localhost:5173", "http://127.0.0.1:5173"] : "*",
    credentials: true
}));

app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
    res.json({ success: true, message: "Server is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.status ? err.message : "Internal server error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }

    console.log(`Server running on port ${PORT}`);
});
