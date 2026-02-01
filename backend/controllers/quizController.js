// controllers/quizController.js
import { supabaseAdmin } from "../supabaseClient.js";
import crypto from "crypto";

/**
 * POST /api/quizzes
 * Create a new quiz
 */
export const createQuiz = async (req, res) => {
  try {
    const {
      title,
      mode,
      method,
      selection_type,
      subject,
      duration,
      timer_per_question,
      max_marks,
      question_ids
    } = req.body;

    const created_by = req.user.id;
    const created_by_role = req.user.role;

    // Validate fields
    if (!title || !mode) {
      return res.status(400).json({ error: "Title and mode are required" });
    }

    // Insert quiz
    const { data: quizData, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .insert([
        {
          id: crypto.randomUUID(),
          title,
          mode,
          method: method || "test",
          selection_type: selection_type || "auto",
          subject: subject || null,
          duration: duration || null,
          timer_per_question: timer_per_question || null,
          max_marks: max_marks || null,
          created_by,
          created_by_role,
          is_active: true
        }
      ])
      .select()
      .single();

    if (quizError) throw quizError;

    const quiz_id = quizData.id;

    // If question_ids provided (manual selection)
    if (question_ids && question_ids.length > 0) {
      const mappingRows = question_ids.map((qid, index) => ({
        id: crypto.randomUUID(),
        quiz_id,
        question_id: qid,
        order: index + 1
      }));

      const { error: mapError } = await supabaseAdmin.from("quiz_questions").insert(mappingRows);
      if (mapError) throw mapError;
    }

    res.status(201).json({ message: "Quiz created", data: quizData });
  } catch (err) {
    console.error("createQuiz error:", err);
    res.status(500).json({ error: err.message || "Failed to create quiz" });
  }
};

/**
 * GET /api/quizzes
 * Fetch all quizzes
 */
export const getAllQuizzes = async (req, res) => {
  try {
    const { mode, subject, created_by } = req.query;

    let query = supabaseAdmin.from("quizzes").select("*").eq("is_active", true);

    if (mode) query = query.eq("mode", mode);
    if (subject) query = query.eq("subject", subject);
    if (created_by) query = query.eq("created_by", created_by);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    res.json({ data });
  } catch (err) {
    console.error("getAllQuizzes error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch quizzes" });
  }
};

/**
 * GET /api/quizzes/:id
 */
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Quiz not found" });

    res.json({ data });
  } catch (err) {
    console.error("getQuizById error:", err);
    res.status(500).json({ error: err.message || "Failed to get quiz" });
  }
};

/**
 * GET /api/quizzes/:id/questions
 * Fetch questions linked to quiz
 */
export const getQuizQuestions = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("quiz_questions")
      .select("order, questions(*)")
      .eq("quiz_id", id)
      .order("order", { ascending: true });

    if (error) throw error;

    const questions = data.map((item) => item.questions);

    res.json({ data: questions });
  } catch (err) {
    console.error("getQuizQuestions error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch quiz questions" });
  }
};

/**
 * PATCH /api/quizzes/:id
 * Update quiz title, mode, etc.
 */
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.id; // Prevent overwriting ID

    const { data, error } = await supabaseAdmin
      .from("quizzes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Quiz updated", data });
  } catch (err) {
    console.error("updateQuiz error:", err);
    res.status(500).json({ error: err.message || "Failed to update quiz" });
  }
};

/**
 * DELETE /api/quizzes/:id
 * Soft delete quiz (is_active = false)
 */
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("quizzes")
      .update({ is_active: false })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Quiz soft-deleted", data });
  } catch (err) {
    console.error("deleteQuiz error:", err);
    res.status(500).json({ error: err.message || "Failed to delete quiz" });
  }
};


// controllers/quizController.js

/**
 * GET /api/quizzes/filter/mode/:mode
 */
export const getQuizzesByMode = async (req, res) => {
  try {
    const { mode } = req.params;
    const { data, error } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("mode", mode)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("getQuizzesByMode error:", err);
    res.status(500).json({ error: err.message || "Failed to filter quizzes by mode" });
  }
};

/**
 * GET /api/quizzes/filter/method/:method
 */
export const getQuizzesByMethod = async (req, res) => {
  try {
    const { method } = req.params;
    const { data, error } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("method", method)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("getQuizzesByMethod error:", err);
    res.status(500).json({ error: err.message || "Failed to filter quizzes by method" });
  }
};

/**
 * GET /api/quizzes/latest?limit=5
 */
export const getLatestQuizzes = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const { data, error } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    console.error("getLatestQuizzes error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch latest quizzes" });
  }
};
