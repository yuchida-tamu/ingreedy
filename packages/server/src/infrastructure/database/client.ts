import { databaseConfig } from '@/config/database.config';
import type { PoolClient, QueryResult } from 'pg';
import { Pool } from 'pg';
import { DatabaseError, getConnectionHint, type PostgresError } from './database-error';

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
};
