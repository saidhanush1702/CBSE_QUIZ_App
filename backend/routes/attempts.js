// routes/attempts.js
import express from "express";
import {
  startQuizAttempt,
  saveAnswer,
  submitQuiz,
  getUserAttempts,
  getUserSkippedQuizzes,
  getQuizResult,
  updateQuizAttemptStatus,
  getUserCompletedQuizzes,
  getUserRevisionQuizzes
} from "../controllers/attemptController.js";

import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Start or resume a quiz attempt
router.post("/:id/start", authenticate, authorize(["student"]), startQuizAttempt);

// Save answer temporarily
router.post("/:id/answer", authenticate, authorize(["student"]), saveAnswer);

// Submit quiz
router.post("/:id/submit", authenticate, authorize(["student"]), submitQuiz);

// View all past attempts
router.get("/user/:user_id/attempts", authenticate, authorize(["student"]), getUserAttempts);

// View skipped quizzes
router.get("/user/:user_id/skipped", authenticate, authorize(["student"]), getUserSkippedQuizzes);

// View result for specific quiz
router.get("/:id/result/:user_id", authenticate, authorize(["student", "teacher"]), getQuizResult);

router.patch("/:id/status", authenticate, authorize(["student"]), updateQuizAttemptStatus);
router.get("/user/:user_id/completed", authenticate, authorize(["student"]), getUserCompletedQuizzes);
router.get("/user/:user_id/revision", authenticate, authorize(["student"]), getUserRevisionQuizzes);



export default router;
