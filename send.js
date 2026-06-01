import { db } from 'hatchable';

export const access = 'member';

// Route: /api/rooms/[id]/send
export default async function(req, res) {
  const { id } = req.params;
  const member = req.member;
  const { content, reply_to } = req.body || {};
  if (!content?.trim()) return res.status(400).json({ error: 'Content required' });
  await db.query(
    `INSERT INTO users (handle, display_name) VALUES ($1, $2) ON CONFLICT (handle) DO NOTHING`,
    [member.handle, member.display_name || member.handle]
  );
  const { rows: uRows } = await db.query('SELECT id FROM users WHERE handle = $1', [member.handle]);
  const userId = uRows[0].id;
  const { rows } = await db.query(
    `INSERT INTO messages (room_id, user_id, content, reply_to) VALUES ($1, $2, $3, $4) RETURNING *`,
    [id, userId, content.trim(), reply_to || null]
  );
  res.json({ message: { ...rows[0], handle: member.handle, display_name: member.display_name, avatar_url: member.avatar_url } });
}
