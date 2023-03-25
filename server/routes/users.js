import Router from '@koa/router'
import { koaBody } from 'koa-body'
import validate from '../middleware/validator.js'
import jwtProtect from '../middleware/jwtProtect.js'
import config from '../config.js'

// controllers
import get from '../controllers/users/get.js'
import create from '../controllers/users/create.js'
import update from '../controllers/users/update.js'
import del from '../controllers/users/del.js'
import authenticate from '../controllers/users/authenticate.js'

const router = new Router()
router.prefix(`${config.server.apiBasePath}/v1`)

// Get users
router.get('/users',
  jwtProtect,
  get.controller
)

// Create user
router.post('/users',
  jwtProtect,
  koaBody(),
  validate(create.schema),
  create.controller
)

// Update user
router.put('/users',
  jwtProtect,
  koaBody(),
  validate(update.schema),
  update.controller
)

// Delete user
router.del('/users/:id',
  jwtProtect,
  del.controller
)

// Authenticate a user and give token
router.post('/users/authorize',
  koaBody(),
  validate(authenticate.schema),
  authenticate.controller
)

export default router
