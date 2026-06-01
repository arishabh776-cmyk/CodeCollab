import { db } from 'hatchable';

export const access = 'member';

export default async function(req, res) {
  const member = req.member;
  const { bio, skills, github_url, twitter_url, website_url, display_name } = req.body || {};
  await db.query(
    `INSERT INTO users (handle, display_name) VALUES ($1, $2) ON CONFLICT (handle) DO NOTHING`,
    [member.handle, member.display_name || member.handle]
  );
  const { rows } = await db.query(
    `UPDATE users SET
      bio = COALESCE($1, bio),
      skills = COALESCE($2, skills),
      github_url = COALESCE($3, github_url),
      twitter_url = COALESCE($4, twitter_url),
      website_url = COALESCE($5, website_url),
      display_name = COALESCE($6, display_name)
     WHERE handle = $7 RETURNING *`,
    [bio, skills, github_url, twitter_url, website_url, display_name, member.handle]
  );
  res.json({ user: rows[0] });
}
