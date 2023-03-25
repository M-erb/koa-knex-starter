import User from '../../services/users.js'

const controller = async ctx => {
  try {
    const { limit, offset, paged } = ctx.query

    const results = await User.find({ limit, offset })
    const cleaned = await User.sanitize(results, ctx.state.user)

    // check if 'limit' is a number and use empty obj if undefined or null
    const isLimited = !isNaN(limit ?? {})

    // only uses paginatged mode if both 'paged' and 'limit' is present
    const isPaginated = isLimited && (paged === 'true')

    const count = isLimited ? await User.count() : null
    const pages = isLimited ? (count / limit) : null
    const payload = isPaginated ? { page: cleaned, limit, offset, pages } : cleaned

    ctx.body = payload
  } catch (error) {
    console.error('user get error: ', error)
    ctx.throw(500, 'could not get users')
  }
}

export default {
  controller
}
