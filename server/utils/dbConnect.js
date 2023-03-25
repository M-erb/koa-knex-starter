import config from '../config.js'
import knex from 'knex'

export default (testDB = false) => {
  return new Promise((resolve, reject) => {
    try {
      const db = knex(config.dbOptions)

      if (testDB) {
        // Test DB connection before resolving
        db.raw('select 1+1 as result').then(res => {
          resolve(db)
        })
      } else resolve(db)
    } catch (error) {
      reject(error)
    }
  })
}
