import User from '../../services/users.js'

const controller = async ctx => {
  const id = Number(ctx.params.id)
  if (!id) ctx.throw(400, new Error('id is required'))
  if (id === ctx.state.user.id) ctx.throw(400, new Error('Cannot delete user you are logged in as'))

  try {
    const count = await User.count()
    if (count > 1) {
      await User.remove(id)
      ctx.body = {
        message: 'success',
        id
      }
    } else {
      ctx.throw(400, 'Cannot delete last user')
    }
  } catch (err) {
    console.error('delete user update error: ', err)
    ctx.throw(500, 'could not delete user')
  }
}

export default {
  controller
}
