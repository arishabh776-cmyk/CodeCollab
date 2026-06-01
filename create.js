import { db } from 'hatchable';

export const access = 'member';

export default async function(req, res) {
  const member = req.member;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, description, is_public, tags, max_members } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Room name required' });
  await db.query(
    `INSERT INTO users (handle, display_name) VALUES ($1, $2) ON CONFLICT (handle) DO NOTHING`,
    [member.handle, member.display_name || member.handle]
  );
  const { rows: userRows } = await db.query('SELECT id FROM users WHERE handle = $1', [member.handle]);
  const userId = userRows[0].id;
  const { rows } = await db.query(
    `INSERT INTO rooms (name, description, is_public, tags, max_members, owner_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, description || '', is_public !== false, tags || [], max_members || 50, userId]
  );
  const room = rows[0];
  await db.query(
    `INSERT INTO room_members (room_id, user_id, role) VALUES ($1, $2, 'owner') ON CONFLICT DO NOTHING`,
    [room.id, userId]
  );
  return res.json({ room });
}
