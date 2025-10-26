import express from "express";
import {
  addQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import { techTeamAuth } from "../middleware/techTeamAuth.js";

const router = express.Router();

router.post("/", techTeamAuth, addQuestion);
router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.put("/:id", techTeamAuth, updateQuestion);
router.delete("/:id", techTeamAuth, deleteQuestion);

export default router;
