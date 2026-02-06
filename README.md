# Basic CRUD API

A simple and secure CRUD (Create, Read, Update, Delete) API for managing users built with Hono and TypeScript.

## Project Overview

This project demonstrates a basic user management system with RESTful endpoints. It includes user creation, retrieval, and updates with secure password hashing and input validation.

## Technology Stack

- **Framework**: [Hono](https://hono.dev/) - Lightweight, fast Node.js web framework
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **Authentication**: Argon2 & Bcrypt for password hashing
- **Validation**: [Zod](https://zod.dev/) for schema validation
- **Package Manager**: pnpm
- **Development**: tsx for TypeScript execution with watch mode

## Features

- Get all users
- Create new user with validation
- Update user information
- Secure password hashing (Argon2)
- Email and password validation with Zod
- PostgreSQL persistence with Prisma ORM
- Error handling with HTTP exceptions

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Retrieve all users |
| POST | `/addUser` | Create a new user |
| PUT | `/updateUser/:userId` | Update user by ID |
| PATCH | `updateEmail/:userId` | Update user email by ID|

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm
- PostgreSQL

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Create a .env file with:
DATABASE_URL="postgresql://user:password@localhost:5432/your_db"

# Run Prisma migrations
pnpm exec prisma migrate dev

# Start development server
pnpm dev
```

## Project Structure

```
.
├── src/
│   ├── index.ts          # Main application file
│   └── models/
│       └── user.ts       # User interface
├── prisma/
│   └── schema.prisma     # Database schema
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema

The project uses a simple User model:

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  password String
}
```

## Requirements

- Email must be valid format
- Password must be at least 8 characters
- Email must be unique in database

---

Built with ❤️ using Hono and TypeScript
