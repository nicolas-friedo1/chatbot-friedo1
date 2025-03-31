const express = require("express");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai"); // Achte auf geschweifte Klammern

const app = express();
app.use(bodyParser.json());

// OpenAI initialisieren
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Webhook Endpoint
app.post("/webhook", async (req, res) => {
  const userMessage = req.body.queryResult.queryText;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const gptResponse = completion.choices[0].message.content;
    res.json({ fulfillmentText: gptResponse });
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.json({ fulfillmentText: "Fehler bei GPT 🚨" });
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
