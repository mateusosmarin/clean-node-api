import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JWTAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (token: string): Promise<string | null> {
    const value = jwt.verify(token, this.secret)
    if (typeof value === 'string') {
      return value
    }
    return JSON.stringify(value)
  }
}
