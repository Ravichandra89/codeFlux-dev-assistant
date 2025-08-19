# API Reference - ReppGPT

This document provides detailed information about the available API endpoints in **ReppGPT**.

---

## 🔑 Authentication

ReppGPT APIs require authentication via an API key.

- Include your API key in the `Authorization` header:

```http
Authorization: Bearer YOUR_API_KEY
```

---

## 📌 Endpoints

### 1. Generate Response
**Endpoint:**  
`POST /api/generate`

**Description:**  
Generates a conversational response based on the provided input.

**Request Body:**
```json
{
  "prompt": "Explain the concept of microservices in simple terms."
}
```

**Response:**
```json
{
  "response": "Microservices is an architectural style..."
}
```

---

### 2. Search Knowledge Base
**Endpoint:**  
`GET /api/search`

**Description:**  
Searches the knowledge base for relevant answers.

**Query Parameters:**
- `query` *(string, required)*: Search term.

**Example Request:**
```http
GET /api/search?query=What is Docker?
```

**Response:**
```json
{
  "results": [
    {
      "title": "Docker Overview",
      "content": "Docker is a platform that allows..."
    }
  ]
}
```

---

### 3. Manage User Sessions
**Endpoint:**  
`POST /api/session`

**Description:**  
Creates a new user session.

**Request Body:**
```json
{
  "userId": "12345"
}
```

**Response:**
```json
{
  "sessionId": "abcde12345",
  "status": "active"
}
```

---

### 4. Submit Feedback
**Endpoint:**  
`POST /api/feedback`

**Description:**  
Submits user feedback about the response quality.

**Request Body:**
```json
{
  "sessionId": "abcde12345",
  "feedback": "The response was helpful!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Feedback submitted."
}
```

---

## ⚡ Error Handling

ReppGPT APIs return standard HTTP status codes:

- `200 OK` – Request successful
- `400 Bad Request` – Invalid input
- `401 Unauthorized` – Missing/invalid API key
- `404 Not Found` – Resource not found
- `500 Internal Server Error` – Server-side issue

**Example Error Response:**
```json
{
  "error": "Invalid API key."
}
```

---

## 📝 Notes
- Always secure your API key and never expose it publicly.
- Rate limits may apply depending on your plan.
