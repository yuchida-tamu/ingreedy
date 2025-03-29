import { databaseConfig } from '@/config/database.config';
import fs from 'fs';
import path from 'path';
import { Client, Pool, PoolClient, QueryResult } from 'pg';

// Initialize database if it doesn't exist
async function initializeDatabase(): Promise<void> {
  const client = new Client({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.username,
    password: databaseConfig.password,
    database: 'postgres',
  });

  try {
    await client.connect();

    // Check if database exists
    const dbExists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [
      databaseConfig.database,
    ]);

    if (dbExists.rows.length === 0) {
      await client.query(`CREATE DATABASE ${databaseConfig.database}`);
      console.info('Database created successfully');
    }
  } finally {
    await client.end();
  }

  // Run initialization SQL if needed
  const initClient = new Client({
    ...databaseConfig,
    database: databaseConfig.database,
  });

  try {
    await initClient.connect();
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await initClient.query(initSql);
  } finally {
    await initClient.end();
  }
}

// Create the connection pool
const pool = new Pool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  user: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  ssl: databaseConfig.ssl,
  max: databaseConfig.maxConnections,
  idleTimeoutMillis: databaseConfig.idleTimeoutMillis,
});

// Test the connection
pool
  .connect()
  .then(() => {
    console.info('Successfully connected to PostgreSQL database');
  })
  .catch((error) => {
    console.error('Failed to connect to PostgreSQL database:', error);
  });

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = {
  query: <T extends Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> => {
    return pool.query(text, params).then((res: QueryResult<T>) => res.rows);
  },
  queryOne: <T extends Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T | null> => {
    return pool.query(text, params).then((res: QueryResult<T>) => res.rows[0] || null);
  },
  getClient: (): Promise<PoolClient> => pool.connect(),
  initialize: initializeDatabase,
};
