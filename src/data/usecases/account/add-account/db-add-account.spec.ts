import {
  AddAccountRepositorySpy,
  HasherSpy,
  LoadAccountByEmailRepositorySpy
} from '@data/test'
import {
  mockAccountModel,
  mockAddAccountParams,
  throwError
} from '@domain/test'
import { EmailInUseError } from '@presentation/errors/email-in-use-error'
import { DbAddAccount } from './db-add-account'

type SUTTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSUT = (): SUTTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.accountModel = null
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  )
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSUT()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(hasherSpy.plaintext).toEqual(addAccountParams.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSUT()
    hasherSpy.hash = throwError
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSUT()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(addAccountRepositorySpy.account).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest
    })
  })

  test('Should throw if DbAddAccount throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSUT()
    addAccountRepositorySpy.add = throwError
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSUT()
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(addAccountRepositorySpy.accountModel)
  })

  test('Should throw EmailInUseError if LoadAccountByEmailRepository returns not null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSUT()
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel()
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrowError(new EmailInUseError())
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSUT()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(loadAccountByEmailRepositorySpy.email).toEqual(addAccountParams.email)
  })
})
