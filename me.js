import { db } from 'hatchable';

export const access = 'member';

export default async function(req, res) {
  const member = req.member;
  await db.query(
    `INSERT INTO users (handle, display_name, avatar_url) VALUES ($1, $2, $3)
     ON CONFLICT (handle) DO UPDATE SET display_name = EXCLUDED.display_name, avatar_url = EXCLUDED.avatar_url`,
    [member.handle, member.display_name || member.handle, member.avatar_url || null]
  );
  const { rows } = await db.query('SELECT * FROM users WHERE handle = $1', [member.handle]);
  res.json({ user: rows[0] });
}
