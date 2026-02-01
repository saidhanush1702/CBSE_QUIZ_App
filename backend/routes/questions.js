// routes/questions.js
import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from "../controllers/questionController.js";

import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

/**
 * Public/Authenticated read endpoints
 * - GET /api/questions           -> list with optional filters (subject, q_type, disabled)
 * - GET /api/questions/:id       -> single question
 */
router.get("/", authenticate, getAllQuestions);
router.get("/:id", authenticate, getQuestionById);

/**
 * Teacher/Admin only: create / update / delete
 */
router.post("/", authenticate, authorize(["teacher", "admin", "tech"]), createQuestion);
router.patch("/:id", authenticate, authorize(["teacher", "admin", "tech"]), updateQuestion);
router.delete("/:id", authenticate, authorize(["teacher", "admin", "tech"]), deleteQuestion);

export default router;
