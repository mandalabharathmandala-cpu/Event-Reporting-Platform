import express from "express";
import cors from "cors";
import loginRouter from "./routes/login.route.js";
import eventRouter from "./routes/event.route.js";

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    headers: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// API Routes
app.use("/api/auth", loginRouter);
app.use("/api/events", eventRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((error, req, res, next) => {
    console.error("Error:", error);
    res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { error: error.stack })
    });
});

export default app;