import { db } from 'hatchable';

export const access = 'member';

export default async function(req, res) {
  const body = req.body || {};
  const { id, content, title, language, room_id } = body;

  // CREATE new snippet
  if (!id || id === 'new') {
    const { rows } = await db.query(
      `INSERT INTO code_snippets (room_id, title, content, language) VALUES ($1, $2, $3, $4) RETURNING *`,
      [room_id || null, title || 'Untitled', content || '', language || 'javascript']
    );
    return res.json({ snippet: rows[0] });
  }

  // UPDATE existing snippet
  const updates = [];
  const vals = [];
  let i = 1;
  if (content !== undefined) { updates.push(`content = $${i++}`); vals.push(content); }
  if (title !== undefined)   { updates.push(`title = $${i++}`);   vals.push(title); }
  if (language !== undefined){ updates.push(`language = $${i++}`); vals.push(language); }
  updates.push('updated_at = NOW()');
  vals.push(id);

  if (updates.length === 1) {
    const { rows } = await db.query('SELECT * FROM code_snippets WHERE id = $1', [id]);
    return res.json({ snippet: rows[0] || null });
  }
  const { rows } = await db.query(
    `UPDATE code_snippets SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`, vals
  );
  res.json({ snippet: rows[0] || null });
}
