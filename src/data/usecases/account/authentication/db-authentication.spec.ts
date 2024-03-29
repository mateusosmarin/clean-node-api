import {
  EncrypterSpy,
  HashComparerSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy
} from '@data/test'
import { mockAuthenticationParams, throwError } from '@domain/test'
import { DbAuthentication } from './db-authentication'

type SUTTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSUT = (): SUTTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSUT()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(loadAccountByEmailRepositorySpy.email).toEqual(
      authenticationParams.email
    )
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSUT()
    loadAccountByEmailRepositorySpy.loadByEmail = throwError
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSUT()
    loadAccountByEmailRepositorySpy.accountModel = null
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSUT()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(hashComparerSpy.plaintext).toEqual(authenticationParams.password)
    expect(hashComparerSpy.digest).toEqual(
      loadAccountByEmailRepositorySpy.accountModel?.password
    )
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSUT()
    hashComparerSpy.compare = throwError
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSUT()
    hashComparerSpy.isValid = false
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSUT()
    await sut.auth(mockAuthenticationParams())
    expect(encrypterSpy.plaintext).toEqual(
      loadAccountByEmailRepositorySpy.accountModel?.id
    )
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSUT()
    encrypterSpy.encrypt = throwError
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSUT()
    const model = await sut.auth(mockAuthenticationParams())
    expect(model?.accessToken).toBe(encrypterSpy.ciphertext)
    expect(model?.name).toBe(loadAccountByEmailRepositorySpy.accountModel?.name)
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositorySpy,
      encrypterSpy,
      loadAccountByEmailRepositorySpy
    } = makeSUT()
    await sut.auth(mockAuthenticationParams())
    expect(updateAccessTokenRepositorySpy.id).toEqual(
      loadAccountByEmailRepositorySpy.accountModel?.id
    )
    expect(updateAccessTokenRepositorySpy.token).toEqual(
      encrypterSpy.ciphertext
    )
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSUT()
    updateAccessTokenRepositorySpy.updateAccessToken = throwError
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
