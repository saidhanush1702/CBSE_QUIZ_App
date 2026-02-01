// routes/quizzes.js
import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getQuizQuestions,
  updateQuiz,
  deleteQuiz,
  getQuizzesByMode,
  getQuizzesByMethod,
  getLatestQuizzes
} from "../controllers/quizController.js";

import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();


// 🆕 New filter routes
router.get("/filter/mode/:mode", authenticate, getQuizzesByMode);
router.get("/filter/method/:method", authenticate, getQuizzesByMethod);
router.get("/latest", authenticate, getLatestQuizzes);


// Create quiz (teacher or student)
router.post("/", authenticate, authorize(["teacher", "student", "admin"]), createQuiz);

// Get all quizzes (all authenticated users)
router.get("/", authenticate, getAllQuizzes);

// Get one quiz by ID
router.get("/:id", authenticate, getQuizById);

// Get quiz questions (all authenticated users)
router.get("/:id/questions", authenticate, getQuizQuestions);

// Update quiz (teacher/admin only)
router.patch("/:id", authenticate, authorize(["teacher", "admin"]), updateQuiz);

// Soft delete quiz (teacher/admin only)
router.delete("/:id", authenticate, authorize(["teacher", "admin"]), deleteQuiz);




export default router;
