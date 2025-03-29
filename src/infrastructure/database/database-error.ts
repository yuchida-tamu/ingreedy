interface PostgresError extends Error {
  code?: string;
  routine?: string;
}

export class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: unknown, public readonly hint?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export function getConnectionHint(error: PostgresError): string {
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

export type { PostgresError };
