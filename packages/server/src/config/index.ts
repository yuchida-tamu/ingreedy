import dotenv from 'dotenv';

dotenv.config();

type TConfig = {
  readonly auth: {
    readonly saltRounds: number;
    readonly jwtSecret: string;
    readonly jwtExpiresIn: string;
  };
  readonly database: {
    readonly host: string;
    readonly port: string;
    readonly username: string;
    readonly password: string;
    readonly name: string;
    readonly ssl: string;
    readonly maxConnections: string;
    readonly idleTimeoutMillis: string;
  };
};

export const config: TConfig = {
  auth: {
    saltRounds: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'ingreedy',
    ssl: process.env.DB_SSL || 'false',
    maxConnections: process.env.DB_MAX_CONNECTIONS || '10',
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || '30000',
  },
} as const;
