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
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Data models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
├── utils/          # Utility functions
├── app.ts         # Express app setup
└── server.ts      # Server entry point
```

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
