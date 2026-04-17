import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// Chat route
app.post("/chat", async (req, res) => {
  console.log("Incoming request:", req.body);

  try {
    const { message, history } = req.body;

    const conversation = history?.length
      ? history.map(m => `${m.role}: ${m.content}`).join("\n")
      : "No previous conversation";

   const prompt = `
You are a professional networking coach.

IMPORTANT RULES:
- Do NOT generate fake names or fake LinkedIn profiles
- Do NOT claim real people unless verified
- Only provide guidance and steps

Role: ${role}

User: ${message}

If user asks for people or contacts:
→ Guide them how to find real professionals using LinkedIn, events, etc.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const reply =
      chatCompletion?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ reply: "Error generating response" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});