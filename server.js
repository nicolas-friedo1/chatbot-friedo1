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
