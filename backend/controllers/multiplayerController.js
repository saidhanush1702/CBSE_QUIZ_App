// controllers/multiplayerController.js
import { supabaseAdmin } from "../supabaseClient.js";
import crypto from "crypto";

/**
 * POST /api/multiplayer/create
 * Body: { quiz_id }
 * Returns session row with join_code
 */
export const createLobby = async (req, res) => {
  try {
    const { quiz_id } = req.body;
    const host_id = req.user.id;

    if (!quiz_id) return res.status(400).json({ error: "quiz_id is required" });

    // generate short join code (6 chars)
    const join_code = crypto.randomBytes(3).toString("hex").toUpperCase();

    const { data, error } = await supabaseAdmin
      .from("multiplayer_sessions")
      .insert([{
        quiz_id,
        host_id,
        join_code,
        players: [],
        is_started: false
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Lobby created", data });
  } catch (err) {
    console.error("createLobby error:", err);
    res.status(500).json({ error: err.message || "Failed to create lobby" });
  }
};

/**
 * POST /api/multiplayer/join
 * Body: { join_code }
 * Adds the authenticated user to session players
 */
export const joinLobby = async (req, res) => {
  try {
    const { join_code } = req.body;
    const user = req.user;

    if (!join_code) return res.status(400).json({ error: "join_code is required" });

    const { data: session, error: sErr } = await supabaseAdmin
      .from("multiplayer_sessions")
      .select("*")
      .eq("join_code", join_code)
      .single();

    if (sErr || !session) return res.status(404).json({ error: "Lobby not found" });
    if (session.is_started) return res.status(400).json({ error: "Session already started" });

    const players = Array.isArray(session.players) ? session.players.filter(p => p.id !== user.id) : [];
    players.push({
      id: user.id,
      name: user.name || user.email,
      avatar: user.avatar_url || null,
      socket_id: null,
      joined_at: new Date().toISOString()
    });

    const { data, error } = await supabaseAdmin
      .from("multiplayer_sessions")
      .update({ players })
      .eq("id", session.id)
      .select()
      .single();

    // Emit lobby update via socket if io present
    const io = req.app.get("io");
    if (io) io.to(session.id).emit("lobby_update", { session_id: session.id, players });

    res.json({ message: "Joined lobby", data });
  } catch (err) {
    console.error("joinLobby error:", err);
    res.status(500).json({ error: err.message || "Failed to join lobby" });
  }
};

/**
 * GET /api/multiplayer/:session_id
 */
export const getLobby = async (req, res) => {
  try {
    const { session_id } = req.params;
    const { data, error } = await supabaseAdmin
      .from("multiplayer_sessions")
      .select("*")
      .eq("id", session_id)
      .single();

    if (error) return res.status(404).json({ error: "Session not found" });
    res.json({ data });
  } catch (err) {
    console.error("getLobby error:", err);
    res.status(500).json({ error: err.message || "Failed to get lobby" });
  }
};

/**
 * POST /api/multiplayer/:session_id/start
 * Host only — set is_started true and broadcast via socket
 */
export const startSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.id;

    // Ensure host
    const { data: session, error: sErr } = await supabaseAdmin
      .from("multiplayer_sessions")
      .select("*")
      .eq("id", session_id)
      .single();

    if (sErr || !session) return res.status(404).json({ error: "Session not found" });
    if (session.host_id !== user_id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Only host can start the session" });
    }

    const { data, error } = await supabaseAdmin
      .from("multiplayer_sessions")
      .update({ is_started: true })
      .eq("id", session_id)
      .select()
      .single();

    if (error) throw error;

    // Broadcast start via socket
    const io = req.app.get("io");
    if (io) io.to(session_id).emit("session_started", { session_id });

    res.json({ message: "Session started", data });
  } catch (err) {
    console.error("startSession error:", err);
    res.status(500).json({ error: err.message || "Failed to start session" });
  }
};

/**
 * POST /api/multiplayer/:session_id/submit
 * Player submits answers via REST (also supported via socket)
 * Body: { answers }
 */
export const submitMultiplayerAnswers = async (req, res) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.id;
    const { answers } = req.body;

    // Persist result
    const { data, error } = await supabaseAdmin
      .from("multiplayer_results")
      .insert([{ session_id, user_id, answers }])
      .select()
      .single();

    if (error) throw error;

    // Optionally compute score here comparing with quiz questions (left as later enhancement)
    const io = req.app.get("io");
    if (io) io.to(session_id).emit("player_submitted", { session_id, user_id, result: data });

    res.json({ message: "Answers submitted", data });
  } catch (err) {
    console.error("submitMultiplayerAnswers error:", err);
    res.status(500).json({ error: err.message || "Failed to submit answers" });
  }
};

/**
 * POST /api/multiplayer/:session_id/end
 * Host ends session, compute leaderboard, set is_ended = true
 */
export const endSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.id;

    // Ensure host
    const { data: session, error: sErr } = await supabaseAdmin
      .from("multiplayer_sessions")
      .select("*")
      .eq("id", session_id)
      .single();

    if (sErr || !session) return res.status(404).json({ error: "Session not found" });
    if (session.host_id !== user_id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Only host can end the session" });
    }

    // Compute leaderboard: aggregate scores from multiplayer_results for this session
    const { data: results } = await supabaseAdmin
      .from("multiplayer_results")
      .select("user_id, score, answers, submitted_at")
      .eq("session_id", session_id);

    // Optionally compute scores if not stored. For now, assume score set in results.
    const leaderboard = (results || [])
      .map(r => ({ user_id: r.user_id, score: r.score || 0, submitted_at: r.submitted_at }))
      .sort((a,b) => b.score - a.score);

    // mark session ended
    const { data, error } = await supabaseAdmin
      .from("multiplayer_sessions")
      .update({ is_ended: true })
      .eq("id", session_id)
      .select()
      .single();

    if (error) throw error;

    const io = req.app.get("io");
    if (io) io.to(session_id).emit("session_ended", { session_id, leaderboard });

    res.json({ message: "Session ended", leaderboard, data });
  } catch (err) {
    console.error("endSession error:", err);
    res.status(500).json({ error: err.message || "Failed to end session" });
  }
};
