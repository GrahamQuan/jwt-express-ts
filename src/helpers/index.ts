import 'dotenv/config'
import { createHmac, randomBytes } from 'crypto'

const SECRET = process.env.SECRET as string

export const random = () => randomBytes(128).toString('base64')
export const authentication = (salt: string, password: string) =>
  createHmac('sha256', [salt, password].join('/')).update(SECRET).digest()

random()
