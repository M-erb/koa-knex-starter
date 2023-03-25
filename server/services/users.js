import dbConnect from '../utils/dbConnect.js'
import argon2 from 'argon2'

const knex = await dbConnect()

export default {
  knex,

  db () {
    return this.knex('users')
  },

  async count () {
    const result = await this.db().count()
    return result[0]['count(*)']
  },

  find (options) {
    const { limit, offset } = options
    if (!isNaN(limit ?? {})) {
      return this.db().limit(limit).offset(offset)
    } else return this.db()
  },

  async findOne (where) {
    const item = await this.db().where(where)
    return item[0]
  },

  async findById (id) {
    const item = await this.db().where({ id: Number(id) })
    return item[0]
  },

  async create (data, returnFirst = true) {
    if (data.password ?? '') {
      const hash = await argon2.hash(data.password)
      data.password = hash
    }

    try {
      const created = await this.db().insert(data)
      const newItems = await this.db().whereIn('id', created)
      const result = returnFirst ? newItems[0] : newItems
      return result
    } catch (error) {
      console.error('create error: ', error)
      throw error
    }
  },

  async update (id, data) {
    if (data.password ?? '') {
      const hash = await argon2.hash(data.password)
      data.password = hash
    }

    try {
      const numUpdated = await this.db().where('id', Number(id)).update(data)
      if (numUpdated === 0) throw new Error('none updated')

      const updated = await this.findById(Number(id))
      return updated
    } catch (error) {
      console.error('update error: ', error)
      throw error
    }
  },

  remove (id) {
    return this.db()
      .where('id', Number(id)).del()
  },

  async comparePassword (id, reqPassword) {
    const userToCheck = await this.findById(Number(id))
    const isMatched = await argon2.verify(userToCheck.password, reqPassword)
    return isMatched
  },

  async sanitize (dataToClean, loggedInUser) {
    if (!dataToClean) return dataToClean
    let result = null

    function cleanIt (data, currentUser) {
      const cleaned = { ...data }
      if (!currentUser || (currentUser.id !== data.id)) {
        // If not the currentUser delete these
        delete cleaned.settings
      }

      // remove regardless
      delete cleaned.password
      return cleaned
    }

    try {
      if (Array.isArray(dataToClean)) {
        result = []
        for (const item of dataToClean) {
          result.push(cleanIt(item, loggedInUser))
        }
      } else {
        result = cleanIt(dataToClean, loggedInUser)
      }

      return result
    } catch (error) {
      console.error('sanitize error: ', error)
      throw error
    }
  }
}
