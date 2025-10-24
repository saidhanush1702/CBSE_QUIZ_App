const sampleQuestions = [
    {
        id: 1,
        q_type: "MCQ",
        difficulty: "Medium",
        subject: "Science",
        chapter_number: 3,
        question: "Which gas is essential for human respiration?",
        answer: "A",
        options: [
            { id: "A", text: "Oxygen" },
            { id: "B", text: "Carbon Dioxide" },
            { id: "C", text: "Nitrogen" },
            { id: "D", text: "Hydrogen" }
        ]
    },
    {
        id: 2,
        q_type: "MCQ",
        difficulty: "Easy",
        subject: "Technology",
        chapter_number: 1,
        question: "Which device is used to input data into a computer?",
        answer: "B",
        options: [
            { id: "A", text: "Monitor" },
            { id: "B", text: "Keyboard" },
            { id: "C", text: "Speaker" },
            { id: "D", text: "Projector" }
        ]
    }
];

export default sampleQuestions;