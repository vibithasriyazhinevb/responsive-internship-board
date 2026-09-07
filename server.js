const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'internships.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database schema
db.serialize(() => {
  db.run(`
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
    )
  `);
});

// Validation middleware
const validateInternship = (req, res, next) => {
  const { title, company, description, stipend, duration } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  if (!company || typeof company !== 'string' || company.trim().length === 0) {
    errors.push('Company is required and must be a non-empty string');
  }
  if (description && typeof description !== 'string') {
    errors.push('Description must be a string');
  }
  if (stipend && (typeof stipend !== 'number' || stipend < 0)) {
    errors.push('Stipend must be a non-negative number');
  }
  if (duration && typeof duration !== 'string') {
    errors.push('Duration must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Helper function to run queries
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// API Routes

// 1. GET /api/internships - List all internships with pagination
app.get('/api/internships', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Page and limit must be positive integers'
      });
    }

    const internships = await dbAll(
      'SELECT * FROM internships ORDER BY posted_date DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const total = await dbGet('SELECT COUNT(*) as count FROM internships');

    res.status(200).json({
      success: true,
      status: 200,
      data: internships,
      pagination: {
        page,
        limit,
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// 2. GET /api/internships/:id - Get a single internship
app.get('/api/internships/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(parseInt(id))) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid internship ID'
      });
    }

    const internship = await dbGet('SELECT * FROM internships WHERE id = ?', [id]);

    if (!internship) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: internship
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// 3. POST /api/internships - Create a new internship
app.post('/api/internships', validateInternship, async (req, res) => {
  try {
    const { title, company, location, description, stipend, duration, status } = req.body;

    const result = await dbRun(
      `INSERT INTO internships (title, company, location, description, stipend, duration, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, company, location || null, description || null, stipend || null, duration || null, status || 'open']
    );

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Internship created successfully',
      data: {
        id: result.lastID,
        title,
        company,
        location,
        description,
        stipend,
        duration,
        status: status || 'open',
        posted_date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// 4. PUT /api/internships/:id - Update an internship
app.put('/api/internships/:id', validateInternship, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, description, stipend, duration, status } = req.body;

    if (!Number.isInteger(parseInt(id))) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid internship ID'
      });
    }

    const existing = await dbGet('SELECT * FROM internships WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Internship not found'
      });
    }

    await dbRun(
      `UPDATE internships SET title = ?, company = ?, location = ?, description = ?, stipend = ?, duration = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, company, location || null, description || null, stipend || null, duration || null, status || 'open', id]
    );

    const updated = await dbGet('SELECT * FROM internships WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Internship updated successfully',
      data: updated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// 5. DELETE /api/internships/:id - Delete an internship
app.delete('/api/internships/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(parseInt(id))) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Invalid internship ID'
      });
    }

    const existing = await dbGet('SELECT * FROM internships WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Internship not found'
      });
    }

    await dbRun('DELETE FROM internships WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'Internship deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    message: 'API is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
