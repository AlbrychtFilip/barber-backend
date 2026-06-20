import type { Knex } from 'knex';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'barber',
    password: process.env.DB_PASSWORD || 'barber_secret',
    database: process.env.DB_NAME || 'barber_db',
  },
  migrations: {
    directory: './src/migrations',
    extension: 'ts',
  },
};

export default config;
