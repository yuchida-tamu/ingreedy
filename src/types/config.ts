export type TConfig = {
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
