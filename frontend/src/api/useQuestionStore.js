import sampleQuestions from "../data/sampleQuestions";

const API_URL = "http://localhost:3000/questions";

export async function fetchQuestions(params = {}) {
    const stored = localStorage.getItem("quizQuestions");
    if (stored) {
        console.log("Loaded from local storage ✅");
        return JSON.parse(stored);
    }

    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_URL}?${queryParams}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("API failed");

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No data from server");
        }

        localStorage.setItem("quizQuestions", JSON.stringify(data));
        console.log("Fetched from backend + cached ✅");
        return data;

    } catch (err) {
        console.warn("Using sample data 📦", err);
        localStorage.setItem("quizQuestions", JSON.stringify(sampleQuestions));
        return sampleQuestions;
    }
}

export function resetQuestionsCache() {
    localStorage.removeItem("quizQuestions");
}