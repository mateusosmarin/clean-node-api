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

const makeSUT = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSUT()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any value')
      expect(hashSpy).toHaveBeenCalledWith('any value', salt)
    })

    test('Should return a valid hash on success', async () => {
      const sut = makeSUT()
      const hash = await sut.hash('any value')
      expect(hash).toBe('hash')
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSUT()
      jest
        .spyOn(bcrypt, 'hash')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .mockImplementationOnce(async () => await Promise.reject(new Error()))
      const promise = sut.hash('any value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSUT()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any value', 'any_value')
      expect(compareSpy).toHaveBeenCalledWith('any value', 'any_value')
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSUT()
      const isValid = await sut.compare('any value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSUT()
      jest
        .spyOn(bcrypt, 'compare')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .mockImplementationOnce(async () => false)
      const isValid = await sut.compare('any value', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSUT()
      jest
        .spyOn(bcrypt, 'compare')
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .mockImplementationOnce(async () => await Promise.reject(new Error()))
      const promise = sut.compare('any value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
