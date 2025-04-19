import { Pool } from 'pg';

const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || process.env.USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ingreedy',
  ssl: process.env.DB_SSL === 'true',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
};

const pool = new Pool({
  ...databaseConfig,
  user: databaseConfig.username,
});

async function checkDatabaseSchema(pool: Pool): Promise<void> {
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
      console.info('\nFunctional indexes on users table:');
      console.table(functionalIndexResult.rows);
    }
  } catch (error) {
    console.error('Failed to check schema:', error);
    process.exit(1);
  }
}

async function checkSchema(): Promise<void> {
  try {
    await checkDatabaseSchema(pool);
    process.exit(0);
  } catch (error) {
    console.error('Failed to check schema:', error);
    process.exit(1);
  }
}

checkSchema();
