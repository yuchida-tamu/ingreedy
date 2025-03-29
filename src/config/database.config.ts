import 'dotenv/config';

export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || process.env.USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ingreedy',
  ssl: process.env.DB_SSL === 'true',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
};

// Validation function to check configuration
export function validateDatabaseConfig(): string[] {
  const errors: string[] = [];

  if (!databaseConfig.username) {
    errors.push(
      'Database username is not configured. Please either:\n' +
        '1. Set DB_USER in your .env file\n' +
        '2. Create a PostgreSQL user matching your system username\n' +
        '3. Create a PostgreSQL user and set it in DB_USER\n\n' +
        'To create a PostgreSQL user, you can run:\n' +
        'createuser -s YOUR_USERNAME\n' +
        'or\n' +
        'sudo -u postgres createuser -s YOUR_USERNAME',
    );
  }

  if (!databaseConfig.host) {
    errors.push('Database host is not configured. Set DB_HOST in .env');
  }

  if (isNaN(databaseConfig.port)) {
    errors.push('Invalid database port. Set DB_PORT in .env');
  }

  return errors;
}
