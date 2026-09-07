# Internship Board API Examples

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. List All Internships

**GET** `/internships`

Query Parameters:
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of records per page

**Example Request:**
```bash
curl http://localhost:3000/api/internships?page=1&limit=5
```

**Example Response:**
```json
{
  "success": true,
  "status": 200,
  "data": [
    {
      "id": 1,
      "title": "Frontend Developer Intern",
      "company": "TechCorp",
      "location": "San Francisco, CA",
      "description": "Build responsive web interfaces using React and modern CSS.",
      "stipend": 5000,
      "duration": "3 months",
      "status": "open",
      "posted_date": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 6,
    "pages": 2
  }
}
```

---

### 2. Get Single Internship

**GET** `/internships/:id`

**Example Request:**
```bash
curl http://localhost:3000/api/internships/1
```

**Example Response:**
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": 1,
    "title": "Frontend Developer Intern",
    "company": "TechCorp",
    "location": "San Francisco, CA",
    "description": "Build responsive web interfaces using React and modern CSS.",
    "stipend": 5000,
    "duration": "3 months",
    "status": "open",
    "posted_date": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "status": 404,
  "message": "Internship not found"
}
```

---

### 3. Create New Internship

**POST** `/internships`

**Required Fields:**
- `title` (string) - Job title
- `company` (string) - Company name

**Optional Fields:**
- `location` (string) - Job location
- `description` (string) - Job description
- `stipend` (number) - Monthly stipend in dollars
- `duration` (string) - Internship duration (e.g., "3 months")
- `status` (string) - Status: "open" or "closed" (default: "open")

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/internships \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Full Stack Developer Intern",
    "company": "StartupXYZ",
    "location": "Remote",
    "description": "Build full-stack web applications with modern tech stack.",
    "stipend": 5500,
    "duration": "3 months",
    "status": "open"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "status": 201,
  "message": "Internship created successfully",
  "data": {
    "id": 7,
    "title": "Full Stack Developer Intern",
    "company": "StartupXYZ",
    "location": "Remote",
    "description": "Build full-stack web applications with modern tech stack.",
    "stipend": 5500,
    "duration": "3 months",
    "status": "open",
    "posted_date": "2024-01-20T14:22:00Z"
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "errors": [
    "Title is required and must be a non-empty string",
    "Company is required and must be a non-empty string"
  ]
}
```

---

### 4. Update Internship

**PUT** `/internships/:id`

All fields are required for updates (title, company, etc.)

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/internships/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Frontend Developer Intern",
    "company": "TechCorp",
    "location": "San Francisco, CA",
    "description": "Build responsive web interfaces with advanced React patterns.",
    "stipend": 6000,
    "duration": "4 months",
    "status": "open"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Internship updated successfully",
  "data": {
    "id": 1,
    "title": "Senior Frontend Developer Intern",
    "company": "TechCorp",
    "location": "San Francisco, CA",
    "description": "Build responsive web interfaces with advanced React patterns.",
    "stipend": 6000,
    "duration": "4 months",
    "status": "open",
    "posted_date": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T15:45:00Z"
  }
}
```

---

### 5. Delete Internship

**DELETE** `/internships/:id`

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/internships/1
```

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Internship deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "status": 404,
  "message": "Internship not found"
}
```

---

### 6. Health Check

**GET** `/health`

**Example Request:**
```bash
curl http://localhost:3000/api/health
```

**Example Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "API is running"
}
```

---

## API Response Format

All responses follow this consistent format:

```json
{
  "success": boolean,
  "status": HTTP status code,
  "message": "Optional descriptive message",
  "data": "Response payload (varies by endpoint)",
  "errors": "Optional array of validation errors",
  "pagination": "Optional pagination info for list endpoints"
}
```

---

## Status Codes

| Code | Meaning |
|------|----------|
| 200  | OK - Request succeeded |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Validation failed or invalid parameters |
| 404  | Not Found - Resource not found |
| 500  | Internal Server Error - Server error |

---

## Validation Rules

| Field | Rules |
|-------|-------|
| `title` | Required, non-empty string |
| `company` | Required, non-empty string |
| `location` | Optional string |
| `description` | Optional string |
| `stipend` | Optional, must be non-negative number |
| `duration` | Optional string |
| `status` | Optional, should be "open" or "closed" |
