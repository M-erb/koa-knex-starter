import Router from '@koa/router'
import config from '../config.js'
import fse from 'fs-extra'

const router = new Router()
router.prefix(`${config.server.adminBasePath}/`)

// For a SPA part of the frontend
// This is only dev/backup, this
// should be handled by a reverse
// proxy like nginx in production.
router.get('/:splat*', async ctx => {
  try {
    const html = await fse.readFile(`${config.server.public}${config.server.adminBasePath}/index.html`, { encoding: 'utf8' })

    ctx.body = html
  } catch (error) {
    console.error('cannot find index.html: ', error)
    ctx.throw(404)
  }
})

export default router
