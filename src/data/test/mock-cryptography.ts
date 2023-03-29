import { Decrypter } from '@data/protocols/cryptography/decrypter'
import { Encrypter } from '@data/protocols/cryptography/encrypter'
import { HashComparer } from '@data/protocols/cryptography/hash-comparer'
import { Hasher } from '@data/protocols/cryptography/hasher'
import { faker } from '@faker-js/faker'

export class HasherSpy implements Hasher {
  plaintext: string
  digest = faker.datatype.uuid()

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.digest
  }
}

export class DecrypterSpy implements Decrypter {
  ciphertext: string
  plaintext: string | null = faker.random.words()

  async decrypt (ciphertext: string): Promise<string | null> {
    this.ciphertext = ciphertext
    return this.plaintext
  }
}

export class EncrypterSpy implements Encrypter {
  plaintext: string
  ciphertext = faker.datatype.uuid()

  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.ciphertext
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string
  digest: string
  isValid = true

  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return this.isValid
  }
}
