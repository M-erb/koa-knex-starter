export default async (ctx, next) => {
  try {
    await next()
    console.log('status: ', ctx.status)
    console.log('request path: ', ctx.request.originalUrl)
    console.log('request type: ', ctx.type)

    const status = ctx.status || 404
    if (status === 404) {
      ctx.throw(404)
    }
  } catch (err) {
    ctx.status = err.status || 500

    if (ctx.status === 404) {
      ctx.body = {
        status: 404,
        message: 'well... we could not find that'
      }
    } else {
      ctx.body = { status: ctx.status, message: err.message }
    }
  }
}
