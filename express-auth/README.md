# Express Authentication Starter Template

A reusable, **database-agnostic** Node.js + TypeScript + Express authentication template. Perfect for building secure backends with JWT-based authentication without being locked into any specific database technology.

## Features

- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ JWT access tokens (15m default)
- ✅ Protected routes with middleware
- ✅ Current user endpoint
- ✅ Input validation with Zod
- ✅ Centralized error handling
- ✅ Structured logging (without credential exposure)
- ✅ Database-agnostic architecture
- ✅ TypeScript with strict mode
- ✅ Clean separation of concerns

## Architecture

```
HTTP Request
    ↓
Route
    ↓
Controller (HTTP concerns)
    ↓
Service (Business logic)
    ↓
UserRepository (Data access abstraction)
    ↓
[Your Database Implementation]
```

### Components

- **Routes** (`src/modules/auth/auth.routes.ts`): Define HTTP endpoints
- **Controllers** (`src/modules/auth/auth.controller.ts`): Handle requests and responses
- **Services** (`src/modules/auth/auth.service.ts`): Implement authentication business logic
- **Repository** (`src/modules/users/user.repository.ts`): Define data access contract
- **Middleware**:
  - `auth.middleware.ts`: JWT verification and user attachment
  - `error.middleware.ts`: Centralized error handling
  - `not-found.middleware.ts`: 404 handling
  - `request-logger.middleware.ts`: Request logging (secure)

## Authentication Flows

### Registration

```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Flow:**

```
Request
  ↓
Validate (Zod schema)
  ↓
Check if email exists
  ↓
Hash password (bcrypt)
  ↓
Store user
  ↓
Return safe user info (HTTP 201)
```

**Response:**

```json
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "User registered successfully"
}
```

**Error Cases:**

- `400`: Validation error
- `409`: Email already registered

### Login

```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Flow:**

```
Request
  ↓
Validate (Zod schema)
  ↓
Find user by email
  ↓
Verify password
  ↓
Generate JWT
  ↓
Return token + user (HTTP 200)
```

**Response:**

```json
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

**Error Cases:**

- `400`: Validation error
- `401`: Invalid credentials (email not found or password mismatch)

### Protected Routes

```
GET /api/auth/me
Authorization: Bearer <token>
```

**Flow:**

```
Request with Authorization header
  ↓
Auth middleware: Extract token
  ↓
Auth middleware: Verify JWT
  ↓
Auth middleware: Attach user ID to request
  ↓
Controller: Retrieve user by ID
  ↓
Return safe user info (HTTP 200)
```

**Response:**

```json
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Cases:**

- `401`: Missing, malformed, invalid, or expired token

## Database Integration

This template intentionally **does not include database code**. The authentication logic is completely independent of any specific database.

### How to Connect a Database

Implement the `UserRepository` interface for your database:

```typescript
// src/database/repositories/postgres-user.repository.ts
import { UserRepository } from '@/modules/users/user.repository';
import { User } from '@/modules/users/user.types';

export class PostgresUserRepository implements UserRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    // Your PostgreSQL query here using Kysely, Prisma, or raw SQL
  }

  async findUserById(userId: string): Promise<User | null> {
    // Your PostgreSQL query here
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    // Your PostgreSQL insert here, generate ID and createdAt
  }
}
```

Then pass it to the server:

```typescript
// src/index.ts
import { startServer } from './server';
import { PostgresUserRepository } from './database/repositories/postgres-user.repository';

const userRepository = new PostgresUserRepository();
startServer(userRepository);
```

### Example Implementations

**PostgreSQL + Kysely:**

```typescript
export class PostgresUserRepository implements UserRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return (
      this.db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst() ?? null
    );
  }
  // ... etc
}
```

**PostgreSQL + Prisma:**

```typescript
export class PrismaUserRepository implements UserRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  // ... etc
}
```

**MongoDB + Mongoose:**

```typescript
export class MongoUserRepository implements UserRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean();
  }
  // ... etc
}
```

The `AuthService` and all other components remain **completely unchanged** regardless of which database you choose.

## Installation

1. **Clone or copy this template**

   ```bash
   cp -r express-auth your-project
   cd your-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:

   ```
   PORT=3000
   JWT_SECRET=your-very-secret-key-here
   JWT_EXPIRES_IN=15m
   ```

4. **Build TypeScript**

   ```bash
   npm run build
   ```

5. **Implement UserRepository for your database**
   - Create a repository class implementing `UserRepository`
   - See Database Integration section above

6. **Start the server**
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable         | Required | Default       | Description                                                  |
| ---------------- | -------- | ------------- | ------------------------------------------------------------ |
| `PORT`           | No       | `3000`        | HTTP server port                                             |
| `JWT_SECRET`     | Yes      | -             | Secret key for signing JWTs. Must be strong and kept secret. |
| `JWT_EXPIRES_IN` | No       | `15m`         | JWT expiration time (e.g., `15m`, `1h`, `7d`)                |
| `NODE_ENV`       | No       | `development` | Environment (`development`, `production`, etc.)              |

**⚠️ IMPORTANT:** Never commit `.env` to version control. Use `.env.example` as a template.

## API Endpoints

| Method | Endpoint             | Auth Required | Description       |
| ------ | -------------------- | ------------- | ----------------- |
| `POST` | `/api/auth/register` | No            | Register new user |
| `POST` | `/api/auth/login`    | No            | Login and get JWT |
| `GET`  | `/api/auth/me`       | Yes           | Get current user  |

## JWT Token

Tokens are kept minimal for security and performance:

```json
{
  "userId": "user-id-here",
  "iat": 1640000000,
  "exp": 1640001000
}
```

- Default expiration: **15 minutes**
- No refresh tokens (simple design)
- Extend expiration time by issuing a new token on login retry

## Validation

Input validation uses **Zod**. Schemas are defined in `src/modules/auth/auth.schema.ts`.

### Registration Validation

- `name`: 2-100 characters
- `email`: Valid email format, normalized to lowercase
- `password`: Minimum 8 characters

### Login Validation

- `email`: Valid email format, normalized to lowercase
- `password`: Required (any non-empty string)

Validation errors return HTTP `400` with message `"Validation failed"`.

## Error Handling

All errors are caught and returned in a consistent format:

```json
{
  "statusCode": 400,
  "message": "Error message here"
}
```

| Status | Scenario                                                      |
| ------ | ------------------------------------------------------------- |
| `400`  | Validation error, malformed request                           |
| `401`  | Authentication failure (invalid credentials or expired token) |
| `404`  | Endpoint not found                                            |
| `409`  | Email already registered (conflict)                           |
| `500`  | Unexpected server error                                       |

**Security:** Stack traces and sensitive details are never exposed to clients.

## Password Security

- Passwords are hashed using **bcrypt** (10 salt rounds)
- Never stored or returned in plaintext
- Never logged to console
- Hashes are validated during login using `comparePassword()`

## Request Logging

Logs include method, path, status code, and duration:

```
POST   /api/auth/login               ---- 200 ---- 18ms
GET    /api/auth/me                  ---- 200 ---- 4ms
POST   /api/auth/login               ---- 401 ---- 7ms
POST   /api/auth/register            ---- 409 ---- 5ms
```

**What is NOT logged (for security):**

- Request bodies (may contain passwords)
- Response bodies
- Authorization headers
- Query parameters
- Passwords or JWT secrets

## Development

### Project Structure

```
express-auth/
├── src/
│   ├── app.ts                          # Express app setup
│   ├── server.ts                       # Server startup
│   ├── config/
│   │   └── env.ts                      # Environment variables
│   ├── middlewares/
│   │   ├── auth.middleware.ts          # JWT verification
│   │   ├── error.middleware.ts         # Error handling
│   │   ├── not-found.middleware.ts     # 404 handling
│   │   └── request-logger.middleware.ts # Request logging
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts      # HTTP handlers
│   │   │   ├── auth.routes.ts          # Route definitions
│   │   │   ├── auth.schema.ts          # Zod validation schemas
│   │   │   ├── auth.service.ts         # Business logic
│   │   │   └── auth.types.ts           # DTO types
│   │   └── users/
│   │       ├── user.repository.ts      # Data access interface
│   │       └── user.types.ts           # User domain types
│   └── shared/
│       ├── auth/
│       │   ├── password.ts             # Password hashing
│       │   └── token.ts                # JWT helpers
│       └── errors/
│           └── app-error.ts            # Error class
├── dist/                               # Compiled JavaScript
├── .env                                # Environment variables (git-ignored)
├── .env.example                        # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

```bash
# Development with live reload
npm run dev

# Build TypeScript
npm run build

# Run compiled code
npm start

# Clean build artifacts
npm run clean
```

### TypeScript

- Strict mode enabled
- Full type safety
- Decorators not used (kept simple)
- ESM modules

## Security Considerations

### Implemented

- ✅ Passwords hashed with bcrypt
- ✅ JWT for stateless authentication
- ✅ Plaintext passwords never stored
- ✅ Password hashes never returned
- ✅ JWT secrets from environment
- ✅ No hardcoded secrets
- ✅ No credentials in logs
- ✅ Generic login error messages (no email enumeration)
- ✅ Access token expiration
- ✅ Input validation with Zod
- ✅ Centralized error handling

### Not Included (Optional Enhancements)

- Refresh tokens (simple 15m expiration)
- Password reset (add as needed)
- Email verification (add as needed)
- Rate limiting (add at reverse proxy or middleware)
- 2FA/MFA (add as extension)
- OAuth/Social login (add as extension)
- Account locking (add as extension)
- HTTPS enforcement (add at reverse proxy)
- CORS configuration (add as needed)

### Deployment Security

- Set a **strong `JWT_SECRET`** (minimum 32 characters)
- Use **HTTPS only** in production
- Set `NODE_ENV=production`
- Keep `.env` files out of version control
- Use a secrets manager for production credentials
- Keep dependencies updated: `npm audit`

## What This Template Is NOT

- ❌ Not a complete authentication framework
- ❌ Not opinionated about your database
- ❌ Not coupled to any ORM or query builder
- ❌ Not production-ready without customization
- ❌ Not implementing advanced features (refresh tokens, MFA, OAuth, etc.)
- ❌ Not a dependency injection container
- ❌ Not following DDD/CQRS/Event Sourcing patterns

## What This Template IS

- ✅ A reusable authentication starter
- ✅ Database-agnostic
- ✅ Clean architecture with separation of concerns
- ✅ Simple and easy to understand
- ✅ Secure by default
- ✅ Fully typed with TypeScript
- ✅ Ready to extend for your use case

## Next Steps

1. Copy this template to your project
2. Implement `UserRepository` for your database
3. Add `.env` with your configuration
4. Implement your `index.ts` entry point
5. Test with curl or Postman
6. Deploy with confidence!

## Example: Complete Server Setup

Create `src/index.ts`:

```typescript
import { startServer } from './server.js';
import { PostgresUserRepository } from './database/repositories/postgres.repository.js';

const userRepository = new PostgresUserRepository();
await startServer(userRepository);
```

Run with:

```bash
npm run dev
```

## License

MIT

## Support

This is a template for learning and building upon. Customize it to match your specific requirements and security needs.

---

**Happy building! 🚀**
