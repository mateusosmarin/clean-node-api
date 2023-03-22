import jwt from 'jsonwebtoken'
import { Decrypter } from '@data/protocols/cryptography/decrypter'
import { Encrypter } from '@data/protocols/cryptography/encrypter'

export class JWTAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (plaintext: string): Promise<string> {
    const ciphertext = jwt.sign({ id: plaintext }, this.secret)
    return ciphertext
  }

  async decrypt (ciphertext: string): Promise<string | null> {
    const plaintext = jwt.verify(ciphertext, this.secret)
    if (typeof plaintext === 'string') {
      return plaintext
    }
    return JSON.stringify(plaintext)
  }
}
