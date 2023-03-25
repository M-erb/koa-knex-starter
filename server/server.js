import config from './config.js'
import chalk from 'chalk'
import Koa from 'koa'
import dbConnect from './utils/dbConnect.js'
import koaStatic from 'koa-static'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import routers from './routes/router.js'
import fourOFour from './routes/404.js'

async function initServer () {
  try {
    await dbConnect(true)
    console.log(chalk.blue(' -=DB Connection Success=- '))
  } catch (error) {
    console.error(chalk.red(' -=DB Connection FAILED=- '))
    console.error(error)

    // Cancel app start
    return
  }

  const app = new Koa()

  // settings
  app.env = config.env
  app.proxy = config.server.trustProxy
  app.context.config = config

  // middleware
  app.use(helmet())
  if (config.cors.enabled) app.use(cors(config.cors.options))
  app.use(koaStatic(config.server.public))
  app.use(fourOFour)

  // Routes
  for (const router of routers) {
    app.use(router.routes())
    app.use(router.allowedMethods())
  }

  return app
}

initServer()
  .then(app => {
    const server = app.listen(config.server.port, () => {
      console.log(chalk.bgBlueBright('------------------------'))
      console.log('Server is up!')
      console.log(`Enviorment: ${config.env}`)
      console.log(chalk.green(`Listening on: http://${config.server.host}:${server.address().port}${config.server.apiBasePath}`))
      console.log(chalk.bgBlueBright('------------------------'))
    })
  })
  .catch(err => {
    console.error(chalk.red(' -=Server Start up FAILED=- '))
    console.error(err)
    throw new Error(err)
  })

process.on('unhandledRejection', (reason, p) =>
  console.error(chalk.red('Unhandled Rejection at: Promise ', p, reason))
)
