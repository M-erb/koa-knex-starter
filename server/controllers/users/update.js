import User from '../../services/users.js'
import yup from 'yup'

const schema = yup.object({
  id: yup.number().required(),
  firstName: yup.string().required(),
  lastName: yup.string(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match')
})

const controller = async ctx => {
  const { id, firstName, lastName, email, password } = ctx.request.body
  const updatePayload = { firstName, lastName, email, password }

  try {
    const updated = await User.update(id, updatePayload)
    const cleaned = await User.sanitize(updated, ctx.state.user)
    ctx.body = cleaned
  } catch (err) {
    if (err.message === 'none updated') {
      ctx.throw(400, err.message)
    } else {
      ctx.throw(500, 'could not update user')
    }
  }
}

export default {
  schema,
  controller
}
