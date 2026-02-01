// routes/multiplayer.js
import express from "express";
import {
  createLobby,
  joinLobby,
  getLobby,
  startSession,
  submitMultiplayerAnswers,
  endSession
} from "../controllers/multiplayerController.js";

import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// create lobby (teacher/host)
router.post("/create", authenticate, authorize(["teacher", "admin"]), createLobby);

// join lobby (any authenticated user)
router.post("/join", authenticate, joinLobby);

// get lobby details
router.get("/:session_id", authenticate, getLobby);

// host starts session
router.post("/:session_id/start", authenticate, startSession);

// player submit via REST (optional — socket submit preferred)
router.post("/:session_id/submit", authenticate, submitMultiplayerAnswers);

// end session (host)
router.post("/:session_id/end", authenticate, endSession);

export default router;
