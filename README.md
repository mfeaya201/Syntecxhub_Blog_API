# Blog API

A simple RESTful blog API built with Node.js, Express, and MongoDB (Mongoose). This project provides user authentication (signup/login) and protected endpoints for creating blog posts.

## Features

- User signup and login with JWT authentication
- Create blog posts (protected route)
- MongoDB Atlas connection
- Basic error handling and health check endpoint

## Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- JWT for auth
- bcrypt for password hashing

## Project Structure

```
blog-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── blogController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── BlogPost.js
│   └── routes/
│       ├── authRoutes.js
│       └── blogRoutes.js
├── .env
├── server.js
└── package.json
```

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd blog-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following values:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

4. Start the server:

```bash
npm run start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Health

- GET `/` — returns `OK` (simple health check)

### Auth

- POST `/api/auth/signup` — register a user
  - Body: `{ "name": "", "email": "", "password": "" }`
- POST `/api/auth/login` — login and receive a JWT
  - Body: `{ "email": "", "password": "" }`
  - Response includes: `{ "token": "<JWT>" }`

### Posts

- POST `/api/posts` — create a blog post (requires `Authorization: Bearer <token>` header)
  - Body: `{ "title": "", "body": "", "tags": ["tag1", "tag2"] }`

- GET `/api/posts` — list posts with pagination, filtering and sorting
  - Query parameters:
    - `limit` (number, default 10)
    - `skip` (number, default 0)
    - `tag` (filter by a tag)
    - `author` (filter by author id)
    - `from` (ISO date string, createdAt >= from)
    - `to` (ISO date string, createdAt <= to)
    - `sort` (`newest` or `oldest`, default `newest`)
  - Example: `/api/posts?limit=5&skip=0&tag=test&sort=newest`

- GET `/api/posts/:id` — get a single post by id (public)

- PUT `/api/posts/:id` — update a post (protected, only author)
  - Body: `{ "title": "", "body": "", "tags": ["tag1"] }`

- DELETE `/api/posts/:id` — delete a post (protected, only author)

## Testing

Use Postman or curl to test the endpoints. Example using `curl`:

```bash
# signup
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Test","email":"t@test.com","password":"password"}'

# login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"t@test.com","password":"password"}'

# create post (replace <TOKEN>)
curl -X POST http://localhost:5000/api/posts -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"title":"Hello","body":"World","tags":["intro"]}'
```

## Example API responses

Sanitized example responses from the test suite are available in the `test_outputs/` folder. These contain sample JSON for:

- `signup.json` — signup response
- `login.json` — login response (token redacted)
- `create_post.json` — created post
- `list_posts.json` — paginated list response
- `get_post.json` — single post
- `update_post.json` — updated post
- `delete_post.json` — delete confirmation
- `filtered_posts.json` — filtered list by tag

You can use these files for screenshots or to validate API behavior during reviews.

## Tips

- Add `PORT` to `.env` if you want to run on a different port.
- Use `nodemon` in development for auto-restart: `npm i -D nodemon` and add script `"dev": "nodemon server.js"`.

## Author

Ayakha Mfengwana — Backend Development Intern

---
