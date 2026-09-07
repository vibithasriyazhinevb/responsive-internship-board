-- Internship Board Database Schema

CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  description TEXT,
  stipend INTEGER,
  duration TEXT,
  status TEXT DEFAULT 'open',
  posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_posted_date ON internships(posted_date);
