import { db } from 'hatchable';

export const access = 'public';

export default async function(req, res) {
  const { q } = req.query;
  if (!q) return res.json({ rooms: [], users: [] });
  const { rows: rooms } = await db.query(
    `SELECT id, name, description, tags FROM rooms
     WHERE is_public = true AND (name ILIKE $1 OR description ILIKE $1 OR $2 = ANY(tags))
     LIMIT 10`,
    [`%${q}%`, q]
  );
  const { rows: users } = await db.query(
    `SELECT handle, display_name, avatar_url, bio FROM users
     WHERE handle ILIKE $1 OR display_name ILIKE $1 LIMIT 10`,
    [`%${q}%`]
  );
  res.json({ rooms, users });
}
