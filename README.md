# Responsive Internship Board API

A Node.js and Express API for managing internship records with validation, pagination, and SQLite persistence.

## Features

✅ Complete CRUD operations (Create, Read, Update, Delete)
✅ Input validation with clear error messages
✅ Pagination support for listing internships
✅ Consistent API response format
✅ SQLite database for data persistence
✅ RESTful API design
✅ CORS enabled for cross-origin requests
✅ Health check endpoint

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Middleware:** CORS, Body Parser

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vibithasriyazhinevb/responsive-internship-board.git
   cd responsive-internship-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database**
   ```bash
   npm run seed
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Verify the API is running**
   ```bash
   curl http://localhost:3000/api/health
   ```

   Expected response:
   ```json
   {
     "success": true,
     "status": 200,
     "message": "API is running"
   }
   ```

## API Documentation

See [API_EXAMPLES.md](./API_EXAMPLES.md) for detailed endpoint documentation and examples.

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/internships` | List all internships (with pagination) |
| GET | `/api/internships/:id` | Get a single internship by ID |
| POST | `/api/internships` | Create a new internship |
| PUT | `/api/internships/:id` | Update an existing internship |
| DELETE | `/api/internships/:id` | Delete an internship |
| GET | `/api/health` | Health check endpoint |

## Database Schema

### Internships Table

```sql
CREATE TABLE internships (
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
```

## Seed Data

The database includes 6 sample internship records:

1. Frontend Developer Intern - TechCorp (San Francisco, CA)
2. Backend Developer Intern - CloudSystems (New York, NY)
3. Data Science Intern - DataInsights (Boston, MA)
4. UX/UI Designer Intern - DesignStudio (Los Angeles, CA)
5. DevOps Engineer Intern - InfraTech (Seattle, WA)
6. Mobile Developer Intern - MobileFirst (Austin, TX)

Run `npm run seed` to populate the database with these records.

## Input Validation

The API validates all inputs and returns clear error messages:

- **title**: Required, must be a non-empty string
- **company**: Required, must be a non-empty string
- **location**: Optional string
- **description**: Optional string
- **stipend**: Optional, must be a non-negative number
- **duration**: Optional string
- **status**: Optional, should be "open" or "closed"

## Pagination

The list endpoint supports pagination via query parameters:

- `page` (default: 1) - Page number
- `limit` (default: 10) - Records per page

Example:
```bash
curl 'http://localhost:3000/api/internships?page=1&limit=5'
```

## Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "status": HTTP_STATUS_CODE,
  "message": "Description (optional)",
  "data": {},
  "errors": [],
  "pagination": {}
}
```

## Error Handling

| Status | Message | Cause |
|--------|---------|-------|
| 400 | Validation failed | Required fields missing or invalid data type |
| 400 | Invalid internship ID | ID is not a valid integer |
| 404 | Internship not found | Resource doesn't exist |
| 500 | Internal server error | Server-side error |

## Project Structure

```
.
├── server.js              # Main Express server and API routes
├── seed.js               # Database seeding script
├── schema.sql            # Database schema definition
├── API_EXAMPLES.md       # Detailed API documentation
├── README.md             # This file
├── package.json          # Project dependencies
└── internships.db        # SQLite database (created after first run)
```

## Development

### Running Tests

You can test the API using:

- **cURL** (command line)
- **Postman** (GUI)
- **Thunder Client** (VS Code extension)
- **REST Client** (VS Code extension)

See [API_EXAMPLES.md](./API_EXAMPLES.md) for example requests.

### Database Management

- **View database**: Use SQLite Browser or command line:
  ```bash
  sqlite3 internships.db
  SELECT * FROM internships;
  ```

- **Reset database**:
  ```bash
  rm internships.db
  npm run seed
  ```

## Environment Variables

Optional:
- `PORT` - Server port (default: 3000)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.
