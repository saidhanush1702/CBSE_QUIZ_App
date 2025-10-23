const express = require("express");
const cors = require("cors");
require("dotenv").config();
const supabase = require("./supabase");

const app = express();
app.use(cors());
app.use(express.json());

const TECH_TEAM_KEY = process.env.TECH_TEAM_KEY;

// Middleware to restrict modifications to Tech team
function techTeamAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== TECH_TEAM_KEY) {
    return res.status(403).json({ error: "Forbidden: Tech team only" });
  }
  next();
}

/**
 * POST /questions
 * Add a new question (Tech team only)
 */
app.post("/questions", techTeamAuth, async (req, res) => {
  try {
    const {
      id,
      question,
      options,
      correct_answer,
      chunk_id,
      q_id,
      q_type,
      max_marks,
      subject,
      grade,
      chapter_number,
      chapter_name,
      explanation,
      new_answer,
      remarks,
      disabled,
      program,
      pdf_path,
      pages,
    } = req.body;

    const { data, error } = await supabase
      .from("questions")
      .insert([
        {
          id,
          question,
          options,
          correct_answer,
          chunk_id,
          q_id,
          q_type,
          max_marks,
          subject,
          grade,
          chapter_number,
          chapter_name,
          explanation,
          new_answer,
          remarks,
          disabled,
          program,
          pdf_path,
          pages,
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /questions
 * Retrieve all questions with optional filters
 */
app.get("/questions", async (req, res) => {
  try {
    const { q_type, subject, grade, chapter_number, disabled } = req.query;

    let query = supabase.from("questions").select("*");

    if (q_type) query = query.eq("q_type", q_type);
    if (subject) query = query.eq("subject", subject);
    if (grade) query = query.eq("grade", grade);
    if (chapter_number) query = query.eq("chapter_number", chapter_number);
    if (disabled !== undefined) query = query.eq("disabled", disabled === "true");

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /questions/:id
 * Retrieve a specific question by ID
 */
app.get("/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: "Question not found" });
  }
});

/**
 * PUT /questions/:id
 * Update a question (Tech team only)
 */
app.put("/questions/:id", techTeamAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("questions")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /questions/:id
 * Delete a question (Tech team only)
 */
app.delete("/questions/:id", techTeamAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("questions")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json({ message: "Question deleted", data: data[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
