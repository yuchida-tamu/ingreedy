import { Pool } from 'pg';
import { DatabaseError, getConnectionHint, type PostgresError } from './database-error';

export async function checkSchema(pool: Pool): Promise<void> {
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
}

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
