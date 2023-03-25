export default schema => {
  return async (ctx, next) => {
    try {
      const options = {
        strict: true,
        abortEarly: false,
        stripUnknown: true
      }

      await schema.validate(ctx.request.body, options)
      await next()
    } catch (err) {
      console.error('validation error: ', err.inner)
      // simple array of errors
      // console.error('validation error: ', err.errors)

      ctx.throw(400, err.message, { errors: err.inner })
    }
  }
}
