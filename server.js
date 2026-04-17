import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});
app.post("/chat", async (req, res) => {
  console.log("Incoming:", req.body);

  try {
    const { message, role } = req.body;

    const prompt = `
You are a professional networking coach.

IMPORTANT RULES:
- Do NOT generate fake names or fake LinkedIn profiles
- Only give guidance, steps, and suggestions

Role: ${role}

User: ${message}
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
      "No response from AI";

    res.json({ reply });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ reply: "Error generating response" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});