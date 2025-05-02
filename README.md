# Ingreedy

A smart recipe management system built with React and Node.js.

## Project Structure

This is a monorepo containing two main packages:

- `packages/server`: Backend API server
- `packages/web`: Frontend React application

## TODO

- [ ] Add Docker support for easy deployment and development
  - Will include Docker Compose setup for running the entire stack
  - No need for local PostgreSQL installation
  - Consistent development environment across all platforms

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v17 or higher)

### Installing PostgreSQL on macOS

You have two options:

- Using Homebrew: `brew install postgresql@17`
- Download [Postgres.app](https://postgresapp.com/) (recommended for beginners)

For other operating systems, visit the [official PostgreSQL download page](https://www.postgresql.org/download/).

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yuchida-tamu/ingreedy.git
   cd ingreedy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Database Setup**

   ```bash
   # Create a new PostgreSQL database
   createdb ingreedy_dev

   # If you prefer using psql
   psql
   CREATE DATABASE ingreedy_dev;
   \q

   # Initialize database schema and tables
   npm run db:init
   ```

   The `db:init` command will:

   - Create necessary database tables
   - Set up initial schema
   - Prepare the database for use

4. **Set up environment variables**

   ```bash
   npm run setup:env
   ```

   This will create `.env` files in both packages by copying from their respective `.env.example` files.

   You can review and modify these files if needed:

   - `packages/web/.env`: Contains frontend configuration
   - `packages/server/.env`: Contains backend configuration and database connection settings

   Default configuration:

   - Frontend will run on `http://localhost:3000`
   - Backend API will run on `http://localhost:8000`
   - Database connection string: `postgresql://localhost:5432/ingreedy_dev`

## Development

### Running the Application

Start both frontend and backend in development mode:

```bash
npm run dev
```

This will start:

- Frontend at `http://localhost:3000`
- Backend at `http://localhost:8000`
- API Documentation at `http://localhost:8000/api-docs`

### Running Individual Services

Run only the frontend:

```bash
npm run dev:web
```

Run only the backend:

```bash
npm run dev:server
```

### API Documentation

The API documentation is available through Swagger UI when running the server:

- Visit `http://localhost:8000/api-docs` in your browser
- The documentation includes:
  - All available endpoints
  - Request/response schemas
  - Authentication requirements
  - Example requests and responses

### Other Available Scripts

- `npm run build`: Build both packages
- `npm run lint`: Run linting on all packages
- `npm run typecheck`: Type-check all packages
- `npm test`: Run tests
- `npm run setup:env`: Set up environment files
- `npm run db:init`: Initialize database schema and tables

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

[Add your license here]
