import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
  },
  async compare (): Promise<boolean> {
    return true
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any value')
    expect(hashSpy).toHaveBeenCalledWith('any value', salt)
  })

  test('Should return a valid hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any value')
    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, 'hash')
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .mockImplementationOnce(async () => await Promise.reject(new Error()))
    const promise = sut.hash('any value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any value', 'any_value')
    expect(compareSpy).toHaveBeenCalledWith('any value', 'any_value')
  })

  test('Should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any value', 'any_hash')
    expect(isValid).toBe(true)
  })
})
