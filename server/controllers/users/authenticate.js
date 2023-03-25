import User from '../../services/users.js'
import yup from 'yup'
import jwt from 'jsonwebtoken'
import config from '../../config.js'

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
})

const controller = async ctx => {
  console.log('jwt: ', jwt)
  const { email, password } = ctx.request.body
  const foundUser = await User.findOne({ email })

  if (foundUser) {
    const isMatched = await User.comparePassword(foundUser.id, password)
    if (isMatched) {
      // Generate and return jwt token
      try {
        const token = jwt.sign({ id: foundUser.id }, config.auth.secret, config.auth.options)
        const cleaned = await User.sanitize(foundUser, foundUser)

        ctx.body = {
          token,
          user: cleaned
        }
      } catch (error) {
        console.error('Login error: ', error)
        loginFailed('There was an issue with logging in', 500)
      }
    } else {
      loginFailed()
    }
  } else {
    loginFailed()
  }

  function loginFailed (message = 'Username or password is incorrect', status = 401) {
    ctx.throw(status, message)
  }
}

export default {
  schema,
  controller
}
