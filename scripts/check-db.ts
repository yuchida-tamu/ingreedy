import { db } from '../src/infrastructure/database/client';

async function checkSchema() {
  try {
    await db.checkSchema();
    process.exit(0);
  } catch (error) {
    console.error('Failed to check schema:', error);
    process.exit(1);
  }
}

checkSchema();
