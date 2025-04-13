# Ingreedy Development Log

## Project Overview

Ingreedy is an inventory & recipe management application that helps users track their ingredients and manage recipes efficiently.

## Project Goals

- Create a robust backend server to handle inventory management
- Implement recipe management functionality
- Provide secure user authentication and authorization
- Enable efficient ingredient tracking and stock management
- Support recipe search and filtering capabilities

## Development Timeline

### Phase 1: Initial Setup (Current)

- [x] Create development log
- [x] Establish coding guidelines and standards
- [x] Set up basic project structure
- [x] Choose and configure database
- [x] Set up basic server configuration
- [x] Implement basic authentication system

### Phase 2: Core Features

- [x] Implement inventory management system
- [ ] Create recipe management endpoints
- [ ] Set up user profile management
- [ ] Implement search functionality

### Phase 3: Advanced Features

- [ ] Add recipe recommendations
- [ ] Implement shopping list generation
- [ ] Add meal planning features
- [ ] Implement inventory alerts and notifications

## Technical Decisions

### Tech Stack (Selected)

- **Backend Framework**: Node.js + Express.js

  - Chosen for its robust ecosystem, excellent package support, and strong community
  - Great performance for API-driven applications
  - Rich middleware ecosystem for various functionalities
  - Easy integration with modern frontend frameworks

- **Database**: PostgreSQL

  - Robust relational database with JSON support
  - Perfect for complex relationships between recipes, ingredients, and users
  - Strong querying capabilities for recipe search and filtering
  - Excellent data integrity and transaction support

- **Authentication**: JWT + Custom Implementation

  - Full control over authentication flow
  - Cost-effective solution
  - Stateless authentication for better scalability
  - Flexibility to integrate third-party services in the future

- **API Documentation**: Swagger/OpenAPI
  - Industry standard documentation
  - Interactive API testing interface
  - Can be automatically generated from code comments
  - Great developer experience for API consumers

### Initial Setup Requirements

- Node.js (Latest LTS version)
- PostgreSQL (Latest stable version)
- npm or yarn for package management
- Development environment variables management (dotenv)

### Key Dependencies (Planned)

- express: Web framework
- pg/sequelize: PostgreSQL client/ORM
- jsonwebtoken: JWT authentication
- bcrypt: Password hashing
- swagger-ui-express: API documentation
- jest: Testing framework
- eslint & prettier: Code quality and formatting

## Project Structure

### Documentation

- `/docs`: Project documentation
  - `/guidelines`: Coding standards and guidelines
  - `/logs`: Daily development logs
  - `/api`: API documentation

For detailed daily progress, please refer to the logs in `/docs/logs/`.
Latest log: [2024-03-26](docs/logs/2024-03-26.md)

## Notes & Ideas

- Consider implementing barcode scanning for easy ingredient input
- Think about recipe scaling functionality
- Plan for ingredient substitution suggestions
- Consider integration with popular grocery delivery services

## Notes for Future Work

### Integration Testing and Dependency Injection

- Plan and design a comprehensive testing strategy for the project.
- Refactor the project to support Dependency Injection (DI) for better testability.
  - Use a DI library like `Awilix` or `InversifyJS` to manage dependencies.
  - Ensure all routes and services can accept mock dependencies for testing.
- Revisit integration tests to ensure they are isolated and do not depend on external systems.
- Create mock implementations for services and repositories to use in tests.

### Next Steps

- Revisit this plan after finalizing the testing strategy.
- Implement DI and update integration tests accordingly.

## Issues & Challenges

(To be updated as development progresses)

---

Last Updated: March 26, 2024
