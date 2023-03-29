import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@data/test'
import { throwError } from '@domain/test'
import { faker } from '@faker-js/faker'
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
  let token: string
  let role: string

  beforeEach(() => {
    token = faker.datatype.uuid()
    role = faker.random.word()
  })

  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSUT()
    await sut.load(token, role)
    expect(decrypterSpy.ciphertext).toEqual(token)
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSUT()
    decrypterSpy.plaintext = null
    const account = await sut.load(token)
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSUT()
    await sut.load(token, role)
    expect(loadAccountByTokenRepositorySpy.token).toEqual(token)
    expect(loadAccountByTokenRepositorySpy.role).toEqual(role)
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSUT()
    loadAccountByTokenRepositorySpy.accountModel = null
    const account = await sut.load(token)
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSUT()
    const account = await sut.load(token)
    expect(account).toEqual(loadAccountByTokenRepositorySpy.accountModel)
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSUT()
    decrypterSpy.decrypt = throwError
    const promise = sut.load(token, role)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSUT()
    loadAccountByTokenRepositorySpy.loadByToken = throwError
    const promise = sut.load(token, role)
    await expect(promise).rejects.toThrow()
  })
})
