import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@data/test'
import { mockAccountModel, throwError } from '@domain/test'
import { DbLoadAccountByToken } from './db-load-account-by-token'

type SUTTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSUT = (): SUTTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  )
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSUT()
    await sut.load('any_token', 'any_role')
    expect(decrypterSpy.ciphertext).toEqual('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSUT()
    jest.spyOn(decrypterSpy, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSUT()
    await sut.load('any_token', 'any_role')
    expect(loadAccountByTokenRepositorySpy.token).toEqual('any_token')
    expect(loadAccountByTokenRepositorySpy.role).toEqual('any_role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSUT()
    loadAccountByTokenRepositorySpy.accountModel = null
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSUT()
    const account = await sut.load('any_token')
    expect(account).toEqual(mockAccountModel())
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSUT()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSUT()
    jest
      .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
      .mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
