// controllers/attemptController.js
import { supabaseAdmin } from "../supabaseClient.js";
import crypto from "crypto";

/**
 * POST /api/quizzes/:id/start
 * Create or resume a quiz attempt for the user
 */
export const startQuizAttempt = async (req, res) => {
  try {
    const quiz_id = req.params.id;
    const user_id = req.user.id;

    // Check if attempt already exists
    const { data: existing } = await supabaseAdmin
      .from("user_attempts")
      .select("*")
      .eq("user_id", user_id)
      .eq("quiz_id", quiz_id)
      .single();

    if (existing) {
      return res.json({ message: "Resumed existing attempt", data: existing });
    }

    // Create new attempt
    const newAttempt = {
      id: crypto.randomUUID(),
      quiz_id,
      user_id,
      status: "in_progress",
      answers: {},
      score: 0,
      started_at: new Date()
    };

    const { data, error } = await supabaseAdmin
      .from("user_attempts")
      .insert([newAttempt])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Quiz attempt started", data });
  } catch (err) {
    console.error("startQuizAttempt error:", err);
    res.status(500).json({ error: err.message || "Failed to start quiz attempt" });
  }
};

/**
 * POST /api/quizzes/:id/answer
 * Save or update an answer for a question during attempt
 */
export const saveAnswer = async (req, res) => {
  try {
    const quiz_id = req.params.id;
    const user_id = req.user.id;
    const { question_id, selected_answer } = req.body;

    if (!question_id) {
      return res.status(400).json({ error: "question_id is required" });
    }

    // Fetch current attempt
    const { data: attempt } = await supabaseAdmin
      .from("user_attempts")
      .select("answers, status")
      .eq("quiz_id", quiz_id)
      .eq("user_id", user_id)
      .single();

    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    if (attempt.status === "completed") return res.status(400).json({ error: "Quiz already submitted" });

    const updatedAnswers = { ...(attempt.answers || {}), [question_id]: selected_answer };

    const { data, error } = await supabaseAdmin
      .from("user_attempts")
      .update({ answers: updatedAnswers })
      .eq("quiz_id", quiz_id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Answer saved", data });
  } catch (err) {
    console.error("saveAnswer error:", err);
    res.status(500).json({ error: err.message || "Failed to save answer" });
  }
};

/**
 * POST /api/quizzes/:id/submit
 * Submit quiz and calculate score
 */
export const submitQuiz = async (req, res) => {
  try {
    const quiz_id = req.params.id;
    const user_id = req.user.id;

    // Fetch attempt
    const { data: attempt } = await supabaseAdmin
      .from("user_attempts")
      .select("answers, status")
      .eq("quiz_id", quiz_id)
      .eq("user_id", user_id)
      .single();

    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    if (attempt.status === "completed") return res.status(400).json({ error: "Already submitted" });

    // Fetch all quiz questions
    const { data: quizQuestions, error: qqError } = await supabaseAdmin
      .from("quiz_questions")
      .select("question_id, questions(correct_answer, max_marks)")
      .eq("quiz_id", quiz_id);

    if (qqError) throw qqError;

    // Calculate score
    let totalScore = 0;
    let totalMarks = 0;

    for (const item of quizQuestions) {
      const qid = item.question_id;
      const correct = item.questions?.correct_answer;
      const marks = item.questions?.max_marks || 1;
      totalMarks += marks;

      if (attempt.answers && attempt.answers[qid] === correct) {
        totalScore += marks;
      }
    }

    const { data, error } = await supabaseAdmin
      .from("user_attempts")
      .update({
        status: "completed",
        score: totalScore,
        total_marks: totalMarks,
        completed_at: new Date()
      })
      .eq("quiz_id", quiz_id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Quiz submitted", data });
  } catch (err) {
    console.error("submitQuiz error:", err);
    res.status(500).json({ error: err.message || "Failed to submit quiz" });
  }
};

/**
 * GET /api/quizzes/user/:user_id/attempts
 */
export const getUserAttempts = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("user_attempts")
      .select("*, quizzes(title, mode, subject)")
      .eq("user_id", user_id)
      .order("started_at", { ascending: false });

    if (error) throw error;

    res.json({ data });
  } catch (err) {
    console.error("getUserAttempts error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch attempts" });
  }
};

/**
 * GET /api/quizzes/user/:user_id/skipped
 */
export const getUserSkippedQuizzes = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("user_attempts")
      .select("*, quizzes(title, mode, subject)")
      .eq("user_id", user_id)
      .eq("status", "in_progress");

    if (error) throw error;

    res.json({ data });
  } catch (err) {
    console.error("getUserSkippedQuizzes error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch skipped quizzes" });
  }
};

/**
 * GET /api/quizzes/:id/result/:user_id
 */
export const getQuizResult = async (req, res) => {
  try {
    const { id, user_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("user_attempts")
      .select("*")
      .eq("quiz_id", id)
      .eq("user_id", user_id)
      .single();

    if (error) return res.status(404).json({ error: "Result not found" });

    res.json({ data });
  } catch (err) {
    console.error("getQuizResult error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch result" });
  }
};


export const updateQuizAttemptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: "Status is required" });

    const { data, error } = await supabaseAdmin
      .from("user_attempts")
      .update({ status })
      .eq("quiz_id", id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Status updated", data });
  } catch (err) {
    console.error("updateQuizAttemptStatus error:", err);
    res.status(500).json({ error: err.message || "Failed to update quiz status" });
  }
};


export const getUserCompletedQuizzes = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("user_attempts")
      .select("*, quizzes(title, subject, mode)")
      .eq("user_id", user_id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false });

    if (error) throw error;

    res.json({ data });
  } catch (err) {
    console.error("getUserCompletedQuizzes error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch completed quizzes" });
  }
};


export const getUserRevisionQuizzes = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Fetch completed attempts
    const { data: attempts, error } = await supabaseAdmin
      .from("user_attempts")
      .select("quiz_id, answers")
      .eq("user_id", user_id)
      .eq("status", "completed");

    if (error) throw error;
    if (!attempts || attempts.length === 0)
      return res.json({ data: [], message: "No completed quizzes found" });

    let revisionItems = [];

    // Loop through attempts
    for (const attempt of attempts) {
      const { quiz_id, answers } = attempt;

      const { data: quizQuestions } = await supabaseAdmin
        .from("quiz_questions")
        .select("question_id, questions(question, correct_answer, explanation)")
        .eq("quiz_id", quiz_id);

      for (const item of quizQuestions) {
        const qid = item.question_id;
        const correct = item.questions.correct_answer;
        const userAns = answers[qid];

        if (!userAns || userAns !== correct) {
          revisionItems.push({
            quiz_id,
            question_id: qid,
            question: item.questions.question,
            correct_answer: correct,
            user_answer: userAns || null,
            explanation: item.questions.explanation
          });
        }
      }
    }

    res.json({ data: revisionItems });
  } catch (err) {
    console.error("getUserRevisionQuizzes error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch revision items" });
  }
};
