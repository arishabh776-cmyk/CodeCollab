import { db } from 'hatchable';

export const access = 'member';

// Route: /api/rooms/[id]/join
export default async function(req, res) {
  const { id } = req.params;
  const member = req.member;
  await db.query(
    `INSERT INTO users (handle, display_name) VALUES ($1, $2) ON CONFLICT (handle) DO NOTHING`,
    [member.handle, member.display_name || member.handle]
  );
  const { rows: uRows } = await db.query('SELECT id FROM users WHERE handle = $1', [member.handle]);
  const userId = uRows[0].id;
  await db.query(
    `INSERT INTO room_members (room_id, user_id, role) VALUES ($1, $2, 'member') ON CONFLICT DO NOTHING`,
    [id, userId]
  );
  res.json({ success: true });
}
