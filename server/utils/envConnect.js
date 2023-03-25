import path from 'path'
import dotenv from 'dotenv'
import Env from 'dotenv-cast'
import __dirname from './dirname.js'
import fse from 'fs-extra'

const appRootPath = path.join(__dirname, '../../')

// Check if .env exists
const exists = await fse.pathExists(`${appRootPath}.env`).catch(e => {
  console.error('Error checking if ".env" file exists', e)
})

if (exists) console.log('".env" file found')
else {
  console.log('WARNING: ".env" file not found, use ".env-example" as a starting point')
  throw new Error('".env" file not found. Expected at root of project, copy from ".env-example" as starting point')
}

dotenv.config()

export const env = Env
