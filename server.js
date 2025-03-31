const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

// OpenAI-Konfiguration mit API-Key aus Umgebungsvariable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST-Route für Dialogflow-Webhook
app.post("/webhook", async (req, res) => {
  const userMessage = req.body.queryResult.queryText;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const gptResponse = completion.data.choices[0].message.content;
    res.json({ fulfillmentText: gptResponse });
  } catch (err) {
    console.error("Fehler bei OpenAI:", err.response?.data || err.message);
    res.json({ fulfillmentText: "Da ist was schiefgelaufen mit GPT 🤖" });
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
