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
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy } = makeSUT()
    await sut.add(mockAddAccountParams())
    expect(addAccountRepositorySpy.account).toEqual({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if DbAddAccount throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSUT()
    jest
      .spyOn(addAccountRepositorySpy, 'add')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSUT()
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(mockAccountModel())
  })

  test('Should throw EmailInUseError if LoadAccountByEmailRepository returns not null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSUT()
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel()
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrowError(new EmailInUseError())
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSUT()
    await sut.add(mockAddAccountParams())
    expect(loadAccountByEmailRepositorySpy.email).toEqual('any_email@mail.com')
  })
})
