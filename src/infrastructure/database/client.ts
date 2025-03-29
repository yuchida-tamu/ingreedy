import { databaseConfig, validateDatabaseConfig } from '@/config/database.config';
import fs from 'fs';
import path from 'path';
import { Client, Pool, PoolClient, QueryResult } from 'pg';

interface PostgresError extends Error {
  code?: string;
  routine?: string;
}

class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: unknown, public readonly hint?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

function getConnectionHint(error: PostgresError): string {
  if (error?.code === '28000' && error?.routine === 'InitializeSessionUserId') {
    return (
      'PostgreSQL user does not exist. You need to either:\n' +
      '1. Create a PostgreSQL user matching your system username:\n' +
      '   createuser -s YOUR_USERNAME\n' +
      '2. Or set DB_USER and DB_PASSWORD in your .env file to an existing PostgreSQL user\n' +
      '3. Or if you have postgres superuser, run:\n' +
      '   sudo -u postgres createuser -s YOUR_USERNAME'
    );
  }
  if (error?.code === '3D000') {
    return 'Database does not exist. Running initialization will create it.';
  }
  if (error?.code === 'ECONNREFUSED') {
    return (
      'PostgreSQL server is not running. Make sure PostgreSQL is installed and running:\n' +
      '- On macOS: brew services start postgresql\n' +
      '- On Linux: sudo service postgresql start\n' +
      '- On Windows: Start PostgreSQL service from Services'
    );
  }
  if (error?.code === '42710') {
    // duplicate_object
    return 'Database object already exists. This is usually not an error, the initialization will continue.';
  }
  if (error?.code === '42P07') {
    // duplicate_table
    return 'Table already exists. This is usually not an error, the initialization will continue.';
  }
  if (error?.code === '42P16') {
    // invalid_table_definition
    return 'Invalid table definition. Check the SQL syntax in init.sql.';
  }
  if (error?.code === '42501') {
    // insufficient_privilege
    return 'Insufficient privileges. Make sure your database user has the necessary permissions.';
  }
  return '';
}

// Initialize database if it doesn't exist
async function initializeDatabase(): Promise<void> {
  // Validate configuration first
  const configErrors = validateDatabaseConfig();
  if (configErrors.length > 0) {
    throw new DatabaseError(
      'Invalid database configuration:\n' + configErrors.map((err) => `- ${err}`).join('\n'),
    );
  }

  const client = new Client({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.username,
    password: databaseConfig.password,
    database: 'postgres', // Connect to default database first
  });

  try {
    await client.connect();
    console.info('Connected to PostgreSQL');

    // Check if database exists
    const dbExists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [
      databaseConfig.database,
    ]);

    if (dbExists.rows.length === 0) {
      await client.query(`CREATE DATABASE ${databaseConfig.database}`);
      console.info(`Database '${databaseConfig.database}' created successfully`);
    } else {
      console.info(`Database '${databaseConfig.database}' already exists`);
    }
  } catch (error) {
    const hint = getConnectionHint(error as PostgresError);
    throw new DatabaseError('Failed to create database', error, hint);
  } finally {
    await client.end().catch(console.error);
  }

  // Run initialization SQL if needed
  const initClient = new Client({
    ...databaseConfig,
    database: databaseConfig.database,
  });

  try {
    await initClient.connect();
    console.info(`Connected to database: ${databaseConfig.database}`);

    // Try to find init.sql in both src and dist directories
    const possiblePaths = [
      path.join(__dirname, 'init.sql'), // dist directory
      path.join(__dirname, '..', '..', '..', 'src', 'infrastructure', 'database', 'init.sql'), // src directory
    ];

    let initSqlPath: string | undefined;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        initSqlPath = p;
        break;
      }
    }

    if (!initSqlPath) {
      throw new DatabaseError(
        `Initialization SQL file not found. Searched in:\n${possiblePaths.join('\n')}`,
        undefined,
        'Make sure init.sql exists in either src/infrastructure/database or dist/infrastructure/database',
      );
    }

    console.info(`Using SQL file: ${initSqlPath}`);
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    await initClient.query(initSql);
    console.info('Database initialization completed successfully');
  } catch (error) {
    const hint = getConnectionHint(error as PostgresError);
    throw new DatabaseError('Failed to initialize database schema', error, hint);
  } finally {
    await initClient.end().catch(console.error);
  }
}

// Create the connection pool
const pool = new Pool({
  ...databaseConfig,
  user: databaseConfig.username,
});

// Handle pool errors
pool.on('error', (err) => {
  const hint = getConnectionHint(err as PostgresError);
  console.error('Unexpected error on idle client', err);
  if (hint) {
    console.error('Hint:', hint);
  }
});

export const db = {
  query: async <T extends Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T[]> => {
    try {
      const res: QueryResult<T> = await pool.query(text, params);
      return res.rows;
    } catch (error) {
      const hint = getConnectionHint(error as PostgresError);
      throw new DatabaseError(`Query failed: ${text}`, error, hint);
    }
  },

  queryOne: async <T extends Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T | null> => {
    try {
      const res: QueryResult<T> = await pool.query(text, params);
      return res.rows[0] || null;
    } catch (error) {
      const hint = getConnectionHint(error as PostgresError);
      throw new DatabaseError(`Query failed: ${text}`, error, hint);
    }
  },

  getClient: async (): Promise<PoolClient> => {
    try {
      return await pool.connect();
    } catch (error) {
      const hint = getConnectionHint(error as PostgresError);
      throw new DatabaseError('Failed to get database client', error, hint);
    }
  },

  initialize: initializeDatabase,

  healthCheck: async (): Promise<boolean> => {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch (error) {
      const hint = getConnectionHint(error as PostgresError);
      console.error('Database health check failed:', error);
      if (hint) {
        console.error('Hint:', hint);
      }
      return false;
    }
  },

  // Add schema check function
  checkSchema: async (): Promise<void> => {
    try {
      const tableInfo = await pool.query(`
        SELECT column_name, data_type, character_maximum_length
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);

      const triggers = await pool.query(`
        SELECT trigger_name, event_manipulation, action_statement
        FROM information_schema.triggers
        WHERE event_object_table = 'users';
      `);

      // Get indexes
      const indexQuery = `
        SELECT 
          i.relname as index_name,
          a.attname as column_name,
          ix.indisunique as is_unique,
          ix.indisprimary as is_primary,
          pg_get_indexdef(ix.indexrelid) as index_definition
        FROM pg_class t
        JOIN pg_index ix ON t.oid = ix.indrelid
        JOIN pg_class i ON ix.indexrelid = i.oid
        JOIN pg_attribute a ON t.oid = a.attrelid
        WHERE t.relname = 'users'
        AND a.attnum = ANY(ix.indkey)
        ORDER BY ix.indisprimary DESC, i.relname;
      `;

      const indexResult = await pool.query(indexQuery);
      console.info('Users table structure:');
      console.table(tableInfo.rows);

      console.info('\nIndexes on users table:');
      console.table(
        indexResult.rows.map((row) => ({
          index_name: row.index_name,
          index_definition: row.index_definition,
          is_unique: row.is_unique,
          is_primary: row.is_primary,
        })),
      );

      console.info('\nTriggers on users table:');
      console.table(triggers.rows);

      // Get functional indexes
      const functionalIndexQuery = `
        SELECT 
          c.relname as index_name,
          pg_get_indexdef(i.indexrelid) as index_definition
        FROM pg_index i
        JOIN pg_class c ON c.oid = i.indexrelid
        JOIN pg_class t ON t.oid = i.indrelid
        WHERE t.relname = 'users'
        AND pg_get_indexdef(i.indexrelid) LIKE '%lower%';
      `;

      const functionalIndexResult = await pool.query(functionalIndexQuery);
      if (functionalIndexResult.rows.length > 0) {
        console.log('\nFunctional indexes on users table:');
        console.table(functionalIndexResult.rows);
      }
    } catch (error) {
      const hint = getConnectionHint(error as PostgresError);
      throw new DatabaseError('Failed to check schema', error, hint);
    }
  },
};
