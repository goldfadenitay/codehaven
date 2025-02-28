# CodeHaven: Enterprise-Grade Node.js Backend Template

![CodeHaven Logo](https://via.placeholder.com/1200x400/3498db/ffffff?text=CodeHaven)

A comprehensive, type-safe, and highly reusable Node.js backend template that follows best practices for enterprise-level application development. CodeHaven provides a safe, well-organized refuge for your backend code.

## 🌟 Features

- **Domain-Driven Architecture**: Organized by business domains with clean separation of concerns
- **Strict Type Safety**: Built with TypeScript using the most restrictive type rules
- **Three-Layer Architecture**: Clear separation between controllers, services, and data access
- **Comprehensive Error Handling**: Custom error system with detailed responses
- **Prisma ORM Integration**: Type-safe database access with PostgreSQL
- **Vitest Testing**: Complete test suite with unit and integration tests
- **Docker Ready**: Easy setup with Docker Compose
- **Complete Documentation**: Thorough explanations and examples

## 📋 Prerequisites

- Node.js 18+
- npm 9+
- Docker and Docker Compose (for local development)
- PostgreSQL (if not using Docker)

## 🌟 Enhanced Features

In addition to the core features, CodeHaven now includes:

- **API Versioning**: Built-in support for API versioning with `/api/v1/` structure
- **Request Tracing**: Every request gets a unique trace ID for improved logging and debugging
- **Advanced Error Handling**: Using ts-pattern for elegant pattern matching in error handling
- **Shared Prisma Client**: Singleton pattern for safe database connection management
- **Request Metrics**: Automatic logging of request duration, start/end timestamps
- **Moment.js Integration**: Consistent date handling throughout the application

## 🚀 Getting Started

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/yourusername/codehaven.git
cd codehaven
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Start the Docker containers:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

4. Run database migrations:

```bash
docker exec codehaven-api npm run db:migrate
```

5. Seed the database (optional):

```bash
docker exec codehaven-api npm run db:seed
```

The API will be available at http://localhost:3000.

### Without Docker

1. Clone the repository:

```bash
git clone https://github.com/yourusername/codehaven.git
cd codehaven
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from the example:

```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL connection string.

5. Run database migrations:

```bash
npm run db:migrate
```

6. Start the development server:

```bash
npm run dev
```

The API will be available at http://localhost:3000.

## 🏗️ Project Structure

```
codehaven/
├── config/                     # Application configuration
├── docker/                     # Docker configurations
├── infrastructure/             # Infrastructure as code
├── prisma/                     # Prisma ORM configuration
├── scripts/                    # Utility scripts
├── src/                        # Source code
│   ├── common/                 # Common utilities and shared code
│   │   ├── db/                 # Database utilities
│   │   │   └── prisma.ts       # Shared Prisma client
│   │   ├── errors/             # Error handling
│   │   ├── utils/              # Utility functions
│   │   └── types/              # Common type definitions
│   ├── domains/                # Business domains
│   │   └── [domain-name]/      # Domain-specific code
│   │       ├── endpoints/      # API endpoints
│   │       │   └── [endpoint]/ # Individual endpoint
│   │       │       ├── index.ts            # Exports controller
│   │       │       ├── [endpoint].controller.ts
│   │       │       ├── [endpoint].service.ts
│   │       │       └── tests/              # Tests for endpoint
│   │       │           ├── [endpoint].controller.test.ts
│   │       │           ├── [endpoint].service.test.ts
│   │       │           └── [endpoint].integration.test.ts
│   │       ├── cronjobs/       # Scheduled jobs
│   │       │   └── [job]/      # Individual job
│   │       │       ├── index.ts
│   │       │       ├── [job].handler.ts
│   │       │       └── tests/
│   │       ├── jobs/           # Manual jobs
│   │       │   └── [job]/      # Individual job
│   │       │       ├── index.ts
│   │       │       ├── [job].handler.ts
│   │       │       └── tests/
│   │       ├── types/          # Domain types
│   │       ├── validators/     # Validation schemas
│   │       └── routes.ts       # Domain routes
│   ├── middleware/             # Application middleware
│   ├── plugins/                # Application plugins
│   ├── routes/                 # API routes
│   │   └── v1/                 # API v1 routes
│   ├── app.ts                  # Express application setup
│   └── server.ts               # Server entry point
```

## 🧪 Testing

The project uses Vitest for testing. Three types of tests are supported:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test entire flows with real database connections
3. **E2E Tests**: Test the entire application from end to end

Run tests with:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔒 Type Safety

CodeHaven is built with TypeScript and configured for maximum type safety:

- Strict type checking is enabled
- No implicit any
- Strict null checks
- Strict function types
- Strict property initialization
- No unchecked indexed access

This configuration ensures maximum reliability and minimum runtime errors.

## 🔧 Configuration

Application configuration is managed using the `config` package. Configuration files are located in the `config/` directory:

- `default.ts`: Default configuration
- `development.ts`: Development environment config
- `production.ts`: Production environment config
- `test.ts`: Test environment config

Environment-specific configuration will override the default configuration.

## 📚 Domain Implementation Examples

### Users Domain

The template includes a complete implementation of a Users domain, which serves as an example of how to structure your own domains using the feature-first approach:

- Each API endpoint has its own folder with dedicated controller and service
- Tests are co-located with the feature they test
- Each feature is focused and single-responsibility
- Type definitions for DTOs are shared across features
- Validation with Zod
- Error handling with ts-pattern
- Complete test coverage (unit, service, integration)

Use this domain as a reference when implementing your own domains.

## 🧩 Adding a New Domain and Endpoint

To add a new domain:

1. Create a new folder under `src/domains/`
2. Create the following structure:
   - `endpoints/` - API endpoints
   - `cronjobs/` - Scheduled jobs
   - `jobs/` - Manual jobs
   - `types/` - Shared type definitions
   - `validators/` - Shared validation schemas
   - `routes.ts` - Domain routes

To add a new endpoint to a domain:

1. Create a new folder under `src/domains/[domain]/endpoints/`
2. Create the following files:
   - `[endpoint].controller.ts` - Controller for the endpoint
   - `[endpoint].service.ts` - Service for the endpoint
   - `index.ts` - Export the controller
   - `tests/` - Tests for the endpoint

Example folder structure for a new "products" domain with "product-create" endpoint:

```
src/domains/products/
├── endpoints/
│   └── product-create/
│       ├── index.ts
│       ├── product-create.controller.ts
│       ├── product-create.service.ts
│       └── tests/
│           ├── product-create.controller.test.ts
│           ├── product-create.service.test.ts
│           └── product-create.integration.test.ts
├── types/
│   └── index.ts
├── validators/
│   └── product.validator.ts
└── routes.ts
```

## 🔄 CI/CD Pipeline

The template includes CI/CD configurations for GitHub Actions:

- `ci.yml`: Runs linting, tests, and builds
- `deployment.yml`: Handles deployment to different environments

## 📄 API Documentation

API documentation is generated using Swagger and available at `/api/docs` when the server is running in development mode.

## 🛠️ Scripts

- `npm run build`: Build the application
- `npm run start`: Start the production server
- `npm run dev`: Start the development server
- `npm run lint`: Lint the code
- `npm run format`: Format the code
- `npm run test`: Run tests
- `npm run db:migrate`: Run database migrations
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push schema changes to the database
- `npm run db:studio`: Open Prisma Studio

## 🔐 Environment Variables

Create a `.env` file based on `.env.example` with the following variables:

```
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/codehaven?schema=public

# Auth
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
