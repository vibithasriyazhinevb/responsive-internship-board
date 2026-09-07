const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'internships.db');
const db = new sqlite3.Database(dbPath);

const seedData = [
  {
    title: 'Frontend Developer Intern',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    description: 'Build responsive web interfaces using React and modern CSS. Work with our design team to implement pixel-perfect UIs.',
    stipend: 5000,
    duration: '3 months',
    status: 'open'
  },
  {
    title: 'Backend Developer Intern',
    company: 'CloudSystems',
    location: 'New York, NY',
    description: 'Develop RESTful APIs using Node.js and Express. Optimize database queries and implement caching strategies.',
    stipend: 5500,
    duration: '3 months',
    status: 'open'
  },
  {
    title: 'Data Science Intern',
    company: 'DataInsights',
    location: 'Boston, MA',
    description: 'Work on machine learning models and data analysis. Collaborate with senior data scientists on real-world projects.',
    stipend: 6000,
    duration: '4 months',
    status: 'open'
  },
  {
    title: 'UX/UI Designer Intern',
    company: 'DesignStudio',
    location: 'Los Angeles, CA',
    description: 'Create wireframes and prototypes for mobile and web applications. Conduct user research and usability testing.',
    stipend: 4500,
    duration: '3 months',
    status: 'open'
  },
  {
    title: 'DevOps Engineer Intern',
    company: 'InfraTech',
    location: 'Seattle, WA',
    description: 'Manage cloud infrastructure, containerization, and CI/CD pipelines. Learn Docker, Kubernetes, and AWS.',
    stipend: 6500,
    duration: '3 months',
    status: 'open'
  },
  {
    title: 'Mobile Developer Intern',
    company: 'MobileFirst',
    location: 'Austin, TX',
    description: 'Develop iOS and Android applications. Work with cross-platform frameworks like React Native.',
    stipend: 5200,
    duration: '3 months',
    status: 'closed'
  }
];

db.serialize(() => {
  // Clear existing data
  db.run('DELETE FROM internships');

  // Insert seed data
  const stmt = db.prepare(`
    INSERT INTO internships (title, company, location, description, stipend, duration, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  seedData.forEach(internship => {
    stmt.run(
      internship.title,
      internship.company,
      internship.location,
      internship.description,
      internship.stipend,
      internship.duration,
      internship.status
    );
  });

  stmt.finalize();

  // Verify data
  db.all('SELECT * FROM internships', (err, rows) => {
    if (err) {
      console.error('Error reading data:', err);
    } else {
      console.log(`✓ Database seeded with ${rows.length} internship records`);
    }
  });
});

db.close();
