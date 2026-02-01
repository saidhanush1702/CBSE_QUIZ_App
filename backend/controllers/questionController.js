// controllers/questionController.js
import { supabaseAdmin } from "../supabaseClient.js";
import crypto from "crypto";

/**
 * GET /api/questions
 * Optional query params: subject, q_type, disabled (true/false), q_id, limit, offset
 */
export const getAllQuestions = async (req, res) => {
  try {
    const { subject, q_type, disabled, q_id, limit = 100, offset = 0 } = req.query;

    let query = supabaseAdmin.from("questions").select("*");

    if (subject) query = query.eq("subject", subject);
    if (q_type) query = query.eq("q_type", q_type);
    if (typeof disabled !== "undefined") {
      const disabledBool = disabled === "true" || disabled === "1";
      query = query.eq("disabled", disabledBool);
    } else {
      // By default hide disabled questions
      query = query.eq("disabled", false);
    }
    if (q_id) query = query.eq("q_id", q_id);

    query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    res.json({ data });
  } catch (err) {
    console.error("getAllQuestions error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch questions" });
  }
};

/**
 * GET /api/questions/:id
 */
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // If not found, supabase returns error
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ data });
  } catch (err) {
    console.error("getQuestionById error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch question" });
  }
};

/**
 * POST /api/questions
 * Body: accept the fields matching your questions schema.
 * Only teachers/admins/tech can call this (enforced in route).
 */
export const createQuestion = async (req, res) => {
  try {
    const payload = req.body || {};

    // Ensure an id exists
    const id = payload.id || crypto.randomUUID();

    const newRow = {
      id,
      question: payload.question ?? "",
      options: payload.options ?? null,
      correct_answer: payload.correct_answer ?? null,
      chunk_id: payload.chunk_id ?? null,
      q_id: payload.q_id ?? null,
      q_type: payload.q_type ?? null,
      max_marks: payload.max_marks ?? null,
      subject: payload.subject ?? null,
      grade: payload.grade ?? null,
      chapter_number: payload.chapter_number ?? null,
      chapter_name: payload.chapter_name ?? null,
      explanation: payload.explanation ?? null,
      new_answer: payload.new_answer ?? null,
      remarks: payload.remarks ?? null,
      disabled: payload.disabled ?? false,
      program: payload.program ?? null,
      pdf_path: payload.pdf_path ?? null,
      pages: payload.pages ?? null,
      created_by: req.user?.id ?? null
    };

    const { data, error } = await supabaseAdmin
      .from("questions")
      .insert([newRow])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Question created", data });
  } catch (err) {
    console.error("createQuestion error:", err);
    res.status(500).json({ error: err.message || "Failed to create question" });
  }
};

/**
 * PATCH /api/questions/:id
 * Body: partial update; only allowed fields will be updated.
 */
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    // Disallow accidental id overwrite
    delete updates.id;

    const { data, error } = await supabaseAdmin
      .from("questions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message || "Failed to update question" });
    }

    res.json({ message: "Question updated", data });
  } catch (err) {
    console.error("updateQuestion error:", err);
    res.status(500).json({ error: err.message || "Failed to update question" });
  }
};

/**
 * DELETE /api/questions/:id
 * We perform a soft delete by setting disabled = true (safer).
 */
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft-delete
    const { data, error } = await supabaseAdmin
      .from("questions")
      .update({ disabled: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message || "Failed to delete question" });
    }

    res.json({ message: "Question disabled (soft-deleted)", data });
  } catch (err) {
    console.error("deleteQuestion error:", err);
    res.status(500).json({ error: err.message || "Failed to delete question" });
  }
};
