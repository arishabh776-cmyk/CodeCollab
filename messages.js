import { db } from 'hatchable';

export const access = 'public';

// Route: /api/rooms/[id]/messages
export default async function(req, res) {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const { rows } = await db.query(
    `SELECT m.*, u.handle, u.display_name, u.avatar_url
     FROM messages m LEFT JOIN users u ON u.id = m.user_id
     WHERE m.room_id = $1 ORDER BY m.created_at DESC LIMIT $2`,
    [id, limit]
  );
  res.json({ messages: rows.reverse() });
}
