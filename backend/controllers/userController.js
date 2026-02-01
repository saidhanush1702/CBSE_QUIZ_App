// controllers/userController.js
import { supabaseAdmin } from "../supabaseClient.js";

/**
 * GET /api/users/:id
 * Fetch user profile (name, email, role, avatar, etc.)
 */
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch from users table (metadata)
    const { data: userData, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, role, avatar_url, created_at")
      .eq("id", id)
      .single();

    if (error || !userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: userData });
  } catch (err) {
    console.error("getUserProfile error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch user profile" });
  }
};

/**
 * GET /api/users/:id/quizzes
 * Fetch quizzes created by this user (teacher/student)
 */
export const getUserQuizzes = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("quizzes")
      .select("id, title, mode, method, subject, created_at, is_active")
      .eq("created_by", id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ data });
  } catch (err) {
    console.error("getUserQuizzes error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch user quizzes" });
  }
};

/**
 * GET /api/users/:id/history
 * Fetch user quiz attempt history (attempted, completed, skipped)
 */
export const getUserHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("user_attempts")
      .select("quiz_id, score, total_marks, status, started_at, completed_at, quizzes(title, subject, mode)")
      .eq("user_id", id)
      .order("started_at", { ascending: false });

    if (error) throw error;

    // Group history by status
    const attempted = data.filter(a => a.status === "in_progress");
    const completed = data.filter(a => a.status === "completed");
    const skipped = data.filter(a => a.status === "skipped");

    res.json({
      data: {
        attempted,
        completed,
        skipped
      }
    });
  } catch (err) {
    console.error("getUserHistory error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch user history" });
  }
};
