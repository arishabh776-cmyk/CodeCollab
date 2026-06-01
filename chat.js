import { ai } from 'hatchable';

export const access = 'member';

export default async function(req, res) {
  const body = req.body || {};
  const { messages, code, language, action } = body;

  const systemPrompt = `You are CodeCollab AI, an expert coding assistant embedded in a collaborative coding platform.
You help developers with code explanation, debugging, optimization, and learning.
Be concise, practical, and use markdown formatting for code blocks.
When showing code, always specify the language in the fenced block.`;

  let msgHistory = Array.isArray(messages) ? [...messages] : [];

  if (action && code) {
    const actionPrompts = {
      explain:  `Explain this ${language || 'code'} clearly and concisely:\n\`\`\`${language || ''}\n${code}\n\`\`\``,
      debug:    `Debug this ${language || 'code'} and identify all issues with fixes:\n\`\`\`${language || ''}\n${code}\n\`\`\``,
      optimize: `Optimize this ${language || 'code'} for performance and readability:\n\`\`\`${language || ''}\n${code}\n\`\`\``,
      review:   `Code review this ${language || 'code'} with constructive feedback:\n\`\`\`${language || ''}\n${code}\n\`\`\``
    };
    msgHistory = [{ role: 'user', content: actionPrompts[action] || actionPrompts.explain }];
  }

  if (!msgHistory.length) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  try {
    const result = await ai.generateText({
      model: 'gemini-flash',
      system: systemPrompt,
      messages: msgHistory,
    });
    res.json({ reply: result.text });
  } catch (err) {
    const msg = err?.message || String(err);
    console.error('AI chat error:', msg);
    if (msg.includes('setup_required') || msg.includes('412') || msg.includes('API key')) {
      return res.status(503).json({
        error: 'ai_not_configured',
        reply: '⚠️ The AI assistant needs a Google AI Studio key. Please add it in your Hatchable project settings.'
      });
    }
    res.status(500).json({
      error: 'ai_error',
      reply: `Sorry, the AI assistant encountered an error: ${msg.slice(0, 120)}`
    });
  }
}
