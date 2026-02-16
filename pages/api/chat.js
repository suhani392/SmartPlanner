import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is missing." });
    }

    const { message, history, tasks, context } = req.body;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Using 'gemini-flash-lite-latest' for higher availability on free tier
        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        const personaContext = `You are a helpful AI assistant for the Smart Task Planner app. 
        Current Date: ${context?.currentDate || 'Unknown'}.
        Current Page: ${context?.page || 'Dashboard'}. 
        
        User's UPCOMING Tasks (Filtered to only show future/today deadlines):
        ${tasks && tasks.length > 0 ? JSON.stringify(tasks.map(t => ({ title: t.title, deadline: t.deadline, priority: t.priority }))) : "No tasks found."}

        CRITICAL DO'S AND DON'TS:
        1. DO give direct, on-point answers without any filler or supportive phrases (NEVER say "That's a great question" or anything similar).
        2. DO NOT introduce yourself or give greetings unless the user explicitly says "hello" or "hi".
        3. DO guide users to the "Login" or "Sign Up" pages if they ask about accounts, but DO NOT offer to do it for them.
        4. DO NOT "fake promise" any internal system actions.
        5. If a user tries to give you private data, refuse and point to the official forms.
        6. Refer to tasks concisely for schedule questions.
        7. Use markdown for formatting, but stay as brief as possible.`;

        const chat = model.startChat({
            history: history || [],
            generationConfig: { maxOutputTokens: 1000 },
        });

        // Prepend context to the user's message
        const prompt = `${personaContext}\n\nUser Question: ${message}`;

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ text });
    } catch (error) {
        console.error("Gemini Details:", error);
        res.status(500).json({
            error: "AI Integration Error",
            details: error.message
        });
    }
}
