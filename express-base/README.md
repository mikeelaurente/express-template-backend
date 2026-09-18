# Node.js Backend Starter Template

A minimal, reusable backend template for Node.js + TypeScript + Express projects.

**Purpose**: Provide a clean, modular foundation that can be reused across different projects without forcing architectural decisions or technology choices.

## Fixed Technologies

- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework

## What's NOT Included

This template intentionally does NOT include:

- Database systems (PostgreSQL, MySQL, MongoDB, SQLite, etc.)
- ORMs/Query builders (Prisma, Drizzle, Kysely, Mongoose, Sequelize, TypeORM, etc.)
- Authentication/Authorization (JWT, OAuth, session management, etc.)
- Caching (Redis, Memcached, etc.)
- Message queues (RabbitMQ, Bull, etc.)
- WebSockets
- Docker/containerization
- Microservices tooling
- Advanced logging frameworks

These should be added **only when your project actually needs them**.

## Folder Structure

```
src/
├── config/
│   └── env.ts                 # Environment variable validation
│
├── modules/
│   └── example/               # Example module demonstrating the pattern
│       ├── example.controller.ts
│       ├── example.service.ts
│       ├── example.routes.ts
│       ├── example.schema.ts
│       └── example.types.ts
│
├── middlewares/
│   ├── error.middleware.ts    # Centralized error handling
│   ├── not-found.middleware.ts
│   └── request-logger.middleware.ts
│
├── shared/
│   ├── errors/
│   │   └── app-error.ts       # Custom AppError class
│   └── utils/                 # Shared utilities (add as needed)
│
├── app.ts                     # Express app configuration
└── server.ts                  # Server startup

.env.example                   # Environment variables template
.gitignore
package.json
tsconfig.json
README.md
```

## Folder Responsibilities

### `config/`

Application configuration and environment variables.

- **env.ts**: Validates and exports all environment variables using Zod
- Centralized location for all configuration

### `modules/`

Feature-based organization. Each feature is a self-contained module.

Example module structure:

```
modules/
└── users/
    ├── users.controller.ts    # HTTP request handling
    ├── users.service.ts       # Business logic
    ├── users.routes.ts        # Route definitions
    ├── users.schema.ts        # Request validation (Zod)
    └── users.types.ts         # TypeScript types/interfaces
```

Each module is independent and can be deleted or added without affecting others.

### `middlewares/`

Cross-cutting HTTP behavior.

- **error.middleware.ts**: Centralized error handling and async error wrapper
- **not-found.middleware.ts**: 404 handling
- **request-logger.middleware.ts**: Request logging with duration

### `shared/`

Genuinely reusable code shared across modules.

- **errors/app-error.ts**: Custom error class for expected application errors
- **utils/**: Utility functions (add as needed)

**Important**: Do not put module-specific code here. Use this only for code that is actually reused across multiple modules.

### `app.ts`

Express application configuration.

- Creates the Express app
- Registers global middleware
- Registers all module routes
- Registers error handling

Keeps configuration separate from server startup.

### `server.ts`

HTTP server startup.

- Imports the configured Express app from `app.ts`
- Starts the server
- Handles graceful shutdown

## Request Lifecycle

Example flow for `GET /api/example`:

```
1. Incoming HTTP Request
   ↓
2. requestLoggerMiddleware
   - Starts timing
   ↓
3. example.routes.ts
   - Route matches GET /api/example
   - Calls exampleController.getExample()
   ↓
4. example.controller.ts (ExampleController)
   - Receives the Express request
   - Validates input (if needed using schemas)
   - Calls exampleService.getExample()
   - Returns HTTP response (200 OK)
   ↓
5. example.service.ts (ExampleService)
   - Contains business logic
   - Returns data to controller
   ↓
6. Response sent to client
   ↓
7. requestLoggerMiddleware
   - Logs: GET /api/example ---- success ---- 12 ms
```

## Installation

1. **Clone or copy this template**

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Copy `.env.example` to `.env`**

   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` with your configuration**
   ```
   PORT=3000
   NODE_ENV=development
   ```

## Running the Application

**Development** (with auto-reload via `tsx`):

```bash
npm run dev
```

**Build** (compile TypeScript to JavaScript):

```bash
npm run build
```

**Production** (run compiled JavaScript):

```bash
npm start
```

Visit http://localhost:3000/api/example to see the example endpoint.

## Creating a New Module

1. Create a new folder under `src/modules/`:

   ```
   src/modules/users/
   ```

2. Create the five core files:

   ```
   users.types.ts      # TypeScript interfaces
   users.schema.ts     # Zod validation schemas
   users.service.ts    # Business logic
   users.controller.ts # HTTP handling
   users.routes.ts     # Route definitions
   ```

3. Import and register the routes in `src/app.ts`:

   ```typescript
   import { usersRouter } from './modules/users/users.routes.js';

   app.use('/api/users', usersRouter);
   ```

4. Build your feature using the established pattern.

## Adding Infrastructure Later

The template is designed to remain flexible as you add infrastructure technologies.

### Example 1: Adding PostgreSQL + Kysely

When you need a database, add to your module:

```
src/modules/users/
├── users.controller.ts
├── users.service.ts
├── users.routes.ts
├── users.schema.ts
├── users.types.ts
└── users.repository.ts    # ← NEW: database access layer
```

**users.repository.ts** handles all database queries using Kysely:

```typescript
import { db } from '../../config/database.js';

export class UsersRepository {
  async findById(id: string) {
    return await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async create(data: CreateUserInput) {
    return await db
      .insertInto('users')
      .values(data)
      .returningAll()
      .executeTakeFirst();
  }
}
```

**users.service.ts** calls the repository:

```typescript
export class UsersService {
  constructor(private repository: UsersRepository) {}

  async getUser(id: string) {
    return this.repository.findById(id);
  }
}
```

**The base architecture remains unchanged** — routes still call controllers, controllers still call services. The only addition is a repository layer between service and database.

### Example 2: Adding MongoDB + Mongoose

Alternatively, you could use Mongoose with a different pattern:

```
src/modules/users/
├── users.controller.ts
├── users.service.ts
├── users.routes.ts
├── users.schema.ts
├── users.types.ts
└── users.model.ts    # ← NEW: Mongoose model
```

**users.model.ts** defines the Mongoose schema:

```typescript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
});

export const User = mongoose.model('User', userSchema);
```

**users.service.ts** uses the model directly:

```typescript
import { User } from './users.model.js';

export class UsersService {
  async getUser(id: string) {
    return await User.findById(id);
  }
}
```

**Again, the base architecture is unchanged** — the only difference is how the service accesses data.

### Key Point

Neither database choice requires changing the base structure. Add infrastructure files only when needed, and the module remains self-contained.

## Design Principles

### 1. Keep the Base Template Small

Don't create files just because they might be useful someday. Every file should serve a purpose.

### 2. Feature-Based Organization

Code belongs in `src/modules/` organized by feature, not by layer.

❌ Avoid:

```
src/controllers/
src/services/
src/repositories/
```

✅ Use:

```
src/modules/users/
src/modules/products/
```

### 3. Infrastructure is Replaceable

The base architecture does NOT depend on any specific database, ORM, cache, or external service.

### 4. Avoid Premature Abstraction

Do NOT create:

- Generic repository interfaces if you only have one implementation
- Dependency injection containers unless truly needed
- Use-case/interactor classes for simple operations
- CQRS, DDD, or event sourcing without a real problem to solve
- Service interfaces that just wrap one class

Add abstractions **when they solve an actual problem**.

### 5. Keep Responsibilities Clear

| Layer           | Responsibility                              |
| --------------- | ------------------------------------------- |
| **Routes**      | Map HTTP endpoints to controllers           |
| **Controllers** | Handle HTTP request/response, minimal logic |
| **Services**    | Business logic and application rules        |
| **Schemas**     | Input validation using Zod                  |
| **Types**       | TypeScript interfaces and types             |
| **Middlewares** | Cross-cutting HTTP concerns                 |
| **Config**      | Application configuration                   |
| **Shared**      | Genuinely reusable utilities                |

## Error Handling

Use the `AppError` class for expected errors:

```typescript
import { AppError } from '../../shared/errors/app-error.js';

if (!user) {
  throw new AppError('User not found', 404);
}

if (!isValid) {
  throw new AppError('Invalid input', 400);
}
```

The error middleware automatically catches these and returns:

```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

For unexpected errors, the middleware returns:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Environment Variables

All environment variables are validated in `src/config/env.ts` using Zod.

Currently supported:

- `PORT` (default: 3000)
- `NODE_ENV` (default: 'development')

Add new variables here, and they'll be typed and validated automatically.

## TypeScript Configuration

The template uses strict TypeScript settings:

- `strict: true` - Strict type checking
- `ES2020` - Modern JavaScript features
- `moduleResolution: node` - Node.js module resolution
- `esModuleInterop: true` - CommonJS/ES module interop

## NPM Scripts

- `npm run dev` - Run in development with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run compiled application
- `npm run clean` - Remove `dist/` folder

## What to Do First

1. Delete the `example` module when starting a real project
2. Create your first real feature module under `src/modules/`
3. Register the routes in `src/app.ts`
4. Add infrastructure (database, auth, etc.) only when needed

## Next Steps

After this template, you might add:

- **Database**: Install Prisma, Drizzle, Kysely, TypeORM, or raw SQL
- **Authentication**: Add JWT, sessions, or OAuth
- **Validation**: Extend Zod schemas or add custom validators
- **Logging**: Add Winston, Pino, or custom logger
- **Testing**: Add Jest, Vitest, or other test framework
- **API Documentation**: Add Swagger/OpenAPI
- **Rate Limiting**: Add rate limiting middleware
- **CORS**: Configure CORS based on your needs

Each can be added independently without disrupting the base structure.

## License

MIT
# express-template-backend
