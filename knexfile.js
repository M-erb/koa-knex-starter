import { env } from './server/utils/envConnect.js'

const dbConfig = {
  client: 'mysql2',
  connection: {
    host: env('DATABASE_HOST', 'localhost'),
    port: env.int('DATABASE_PORT', 3306),
    user: env('DATABASE_USERNAME', 'root'),
    password: env('DATABASE_PASSWORD', '1234'),
    database: env('DATABASE_NAME', 'connetify_db')
  },
  useNullAsDefault: true,
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  }
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default dbConfig
