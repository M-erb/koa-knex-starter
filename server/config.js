import path from 'path'
import __dirname from './utils/dirname.js'
import { env } from './utils/envConnect.js'
import deepFreeze from './utils/deepFreeze.js'

const config = {
  env: env('NODE_ENV', 'development'),

  server: {
    host: env('HOST', 'localhost'),
    port: env.int('PORT', 3000),
    apiBasePath: env('VITE_BASE_PATH_API', '/'),
    adminBasePath: env('VITE_ADMIN_BASE_PATH', '/admin'),
    public: path.join(__dirname, '../../public'),
    trustProxy: env.bool('TRUST_PROXY', true),
    logger: true
  },

  cors: {
    enabled: env.bool('CORS_ENABLED', false),
    options: {
      origin: (ctx) => {
        const validDomains = env.array('CORS_ORIGIN', [`http://localhost:${env.int('PORT', 3000)}`])

        if (!ctx.request.header.origin) return validDomains[0]

        const domain = validDomains.find(item => item.toLowerCase() === ctx.request.header.origin?.toLowerCase())

        if (domain) return domain
        return validDomains[0]
      }
    }
  },

  // AUTHENTICATION
  auth: {
    secret: env('JWT_SECRET', 'WoUlD^t=yOuL1K3_2kn0w#'),
    options: {
      algorithm: 'HS256',
      expiresIn: '1d'
    }
  },

  // DATABASE
  dbOptions: {
    client: env('DATABASE_CLIENT', 'mysql2'),
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 3306),
      user: env('DATABASE_USERNAME', 'root'),
      password: env('DATABASE_PASSWORD', '1234'),
      database: env('DATABASE_NAME', 'your_db')
    },
    useNullAsDefault: true
  },

  // BUILD LIST
  buildFilesList: env.array('BUILD_LIST', [
    'public',
    'server',
    '.env-example',
    '.nvmrc',
    'ecosystem.config.cjs',
    'knexfile.js',
    'package.json',
    'package-lock.json',
    'README.md'
  ])
}

deepFreeze(config)

export default config
