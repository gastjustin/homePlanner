import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post('/api/plan', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'AI is not configured. Add OPENAI_API_KEY to .env.' });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { budget, projects, schedule } = req.body;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
      input: [
        {
          role: 'system',
          content: 'You are a practical home-project planning assistant. Write a warm, concise plan for a couple. Do not change the math provided. Call out sequencing, budget risk, and sensible contractor coordination. Avoid salesy language.'
        },
        {
          role: 'user',
          content: `Create a wife-friendly summary of this home improvement plan.\n\nWeekly budget: $${budget.weeklyBudget}\nAlready saved: $${budget.startingBalance}\nContingency: ${budget.contingencyPct}%\n\nProjects:\n${JSON.stringify(projects, null, 2)}\n\nCalculated schedule:\n${JSON.stringify(schedule, null, 2)}\n\nUse short paragraphs and a small bullet list of the most important next actions.`
        }
      ]
    });

    res.json({ text: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message || 'AI planning failed.' });
  }
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`AI server listening on http://localhost:${port}`));
