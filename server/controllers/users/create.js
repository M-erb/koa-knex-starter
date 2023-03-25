import User from '../../services/users.js'
import yup from 'yup'

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string(),
  email: yup.string().email().required(),
  password: yup.string().required()
})

const controller = async ctx => {
  const payload = {
    ...ctx.request.body,
    active: true
  }

  try {
    const users = await User.create(payload)
    const cleaned = await User.sanitize(users)
    ctx.body = cleaned
  } catch (error) {
    const isDup = error.message?.includes('Duplicate entry')

    if (isDup) {
      ctx.throw(400, 'duplicate entry')
    } else {
      console.error('create user error: ', error)
      ctx.throw(500, 'could not create user')
    }
  }
}

export default {
  schema,
  controller
}
