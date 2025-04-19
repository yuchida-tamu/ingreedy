import type { Pool } from 'pg';
import { getConnectionHint, type PostgresError } from './database-error';

export async function healthCheck(pool: Pool): Promise<boolean> {
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
}
