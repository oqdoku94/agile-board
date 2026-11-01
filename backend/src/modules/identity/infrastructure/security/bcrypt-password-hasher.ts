import type IPasswordHasher from '../../application/abstraction/password-hasher.js'
import bcrypt from 'bcrypt'

export default class BcryptPasswordHasher implements IPasswordHasher {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
