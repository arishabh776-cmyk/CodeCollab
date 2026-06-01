import { db } from 'hatchable';

export const access = 'public';

export default async function(req, res) {
  const { rows } = await db.query(
    `SELECT r.*, COUNT(rm.id) as member_count
     FROM rooms r
     LEFT JOIN room_members rm ON rm.room_id = r.id
     WHERE r.is_public = true
     GROUP BY r.id
     ORDER BY member_count DESC, r.created_at DESC
     LIMIT 20`
  );
  res.json({ rooms: rows });
}
