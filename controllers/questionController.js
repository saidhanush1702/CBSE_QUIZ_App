import supabase from "../config/supabase.js";

/** POST /questions */
export const addQuestion = async (req, res) => {
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
};

/** GET /questions */
export const getQuestions = async (req, res) => {
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
};

/** GET /questions/:id */
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch {
    res.status(404).json({ error: "Question not found" });
  }
};

/** PUT /questions/:id */
export const updateQuestion = async (req, res) => {
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
};

/** DELETE /questions/:id */
export const deleteQuestion = async (req, res) => {
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
};
