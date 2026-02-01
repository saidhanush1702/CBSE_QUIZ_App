// routes/users.js
import express from "express";
import {
  getUserProfile,
  getUserQuizzes,
  getUserHistory
} from "../controllers/userController.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get user profile (auth required)
router.get("/:id", authenticate, getUserProfile);

// Get quizzes created by the user
router.get("/:id/quizzes", authenticate, getUserQuizzes);

// Get quiz history (attempted, completed, skipped)
router.get("/:id/history", authenticate, getUserHistory);

export default router;
