import { db } from 'hatchable';

export const access = 'public';

// Route: /api/snippets/[id]
export default async function(req, res) {
  const { id } = req.params;
  const { rows } = await db.query(`SELECT * FROM code_snippets WHERE id = $1`, [id]);
  if (!rows.length) return res.status(404).json({ error: 'Snippet not found' });
  res.json({ snippet: rows[0] });
}
