# Ingreedy Server

Backend server for Ingreedy - an inventory and recipe management application.

## Features

- RESTful API for managing recipes and ingredients
- User authentication and authorization
- Rate limiting and security middleware
- Environment-based configuration
- TypeScript for type safety
- Express.js for routing and middleware
- Comprehensive error handling
- API documentation (coming soon)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TypeScript knowledge

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ingreedy-server.git
   cd ingreedy-server
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your configuration.

4. Start development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler checks
- `npm test` - Run tests

## Project Structure

```
src/
├── core/           # Core domain entities and business rules
│   └── domain/     # Domain entities and interfaces
├── infrastructure/ # Infrastructure implementations
│   └── repositories/ # Concrete repository implementations
├── config/         # Configuration files and environment setup
├── controllers/    # HTTP request handlers
├── middleware/     # Express middleware (auth, error handling, etc.)
├── models/         # Data models and schemas
├── repositories/   # Repository interfaces and implementations
├── routes/         # API route definitions
├── services/       # Application services and business logic
├── types/          # TypeScript types and interfaces
│   ├── api/       # API-related types (requests, responses)
│   └── errors/    # Error types and classes
├── utils/          # Utility functions and helpers
├── app.ts         # Express app setup and configuration
└── index.ts       # Application entry point
```

### Directory Details

- **core/**: Contains the core business logic and domain entities, following Domain-Driven Design principles
  - **domain/**: Domain entities, value objects, and repository interfaces
- **infrastructure/**: Implementation of interfaces defined in the core domain
  - **repositories/**: Concrete implementations of repository interfaces (e.g., in-memory, database)
- **config/**: Application configuration, environment variables, and constants
- **controllers/**: HTTP request handlers that use services to process requests
- **middleware/**: Express middleware for cross-cutting concerns
  - Error handling
  - Authentication
  - Request validation
  - Logging
- **models/**: Data models and database schemas
- **repositories/**: Repository pattern implementation
  - Repository interfaces
  - Data access layer
- **routes/**: API route definitions and endpoint grouping
- **services/**: Application services that implement business logic
  - Orchestrate between repositories and domain entities
  - Handle business rules and workflows
- **types/**: TypeScript type definitions
  - **api/**: Request/Response types
  - **errors/**: Custom error types and error handling
- **utils/**: Helper functions and shared utilities

## API Documentation

API documentation will be available at `/api-docs` when the server is running (coming soon).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Your Name - your.email@example.com

Project Link: https://github.com/yourusername/ingreedy-server
