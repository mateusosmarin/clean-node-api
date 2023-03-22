import { Decrypter } from '@data/protocols/cryptography/decrypter'
import { Encrypter } from '@data/protocols/cryptography/encrypter'
import { HashComparer } from '@data/protocols/cryptography/hash-comparer'
import { Hasher } from '@data/protocols/cryptography/hasher'

export class HasherSpy implements Hasher {
  plaintext: string

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return 'hashed_password'
  }
}

export class DecrypterSpy implements Decrypter {
  ciphertext: string

  async decrypt (ciphertext: string): Promise<string | null> {
    this.ciphertext = ciphertext
    return 'decrypted_token'
  }
}

export class EncrypterSpy implements Encrypter {
  plaintext: string

  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return 'any_token'
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string
  digest: string

  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return true
  }
}
