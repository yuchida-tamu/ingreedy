import { config } from './index';

export const databaseConfig = {
  host: config.database.host || 'localhost',
  port: parseInt(config.database.port || '5432', 10),
  username: config.database.username || 'postgres',
  password: config.database.password || '',
  database: config.database.name || 'ingreedy',
  ssl: config.database.ssl === 'true',
  maxConnections: parseInt(config.database.maxConnections || '10', 10),
  idleTimeoutMillis: parseInt(config.database.idleTimeoutMillis || '30000', 10),
} as const;
