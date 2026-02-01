// routes/test.js
import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/public", (req, res) => {
  res.json({ ok: true, message: "Public endpoint" });
});

router.get("/me", authenticate, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// teacher-only route example
router.get("/teacher-only", authenticate, authorize("teacher"), (req, res) => {
  res.json({ ok: true, message: "Hello teacher", user: req.user });
});

export default router;
