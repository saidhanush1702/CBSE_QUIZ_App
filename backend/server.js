// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import testRoutes from "./routes/test.js";
import questionsRoutes from "./routes/questions.js";
import quizzesRoutes from "./routes/quizzes.js";
import attemptsRoutes from "./routes/attempts.js";
import usersRoutes from "./routes/users.js";
import multiplayerRoutes from "./routes/multiplayer.js";

import { initSocket } from "./socket/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// Routes
app.use("/api/test", testRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/quizzes", attemptsRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/multiplayer", multiplayerRoutes);

// Default 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

// Initialize socket.io and attach to app for controllers to use
const io = initSocket(httpServer);
app.set("io", io);

httpServer.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
