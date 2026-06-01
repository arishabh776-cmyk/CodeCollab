-- Sample rooms
INSERT INTO rooms (name, description, is_public, tags, max_members) VALUES
  ('JavaScript Fundamentals', 'Learn JS basics together', true, ARRAY['javascript', 'beginners'], 30),
  ('Python Data Science', 'Data science study group', true, ARRAY['python', 'data-science'], 25),
  ('LeetCode Grind', 'Daily algorithm challenges', true, ARRAY['algorithms', 'interviews'], 50),
  ('React & Next.js', 'Modern frontend development', true, ARRAY['react', 'nextjs', 'frontend'], 40),
  ('System Design', 'System design interview prep', true, ARRAY['system-design', 'architecture'], 35);
