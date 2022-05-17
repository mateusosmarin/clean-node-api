import {
  EmailInUseError,
  MissingParamError,
  ServerError
} from '@presentation/errors'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '@presentation/helpers/http/http-helper'
import { HttpRequest, Validation } from '@presentation/protocols'
import { SignUpController } from './signup-controller'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Authentication,
  AuthenticationModel
} from './signup-controller-protocols'

type SUTTypes = {
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
  sut: SignUpController
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any name',
    email: 'any_email@email.com',
    password: 'any password',
    passwordConfirmation: 'any password'
  }
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid id',
        name: 'valid name',
        email: 'valid_email@email.com',
        password: 'valid password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string | null> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeSUT = (): SUTTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  )
  return {
    addAccountStub,
    validationStub,
    authenticationStub,
    sut
  }
}

describe('Signup Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSUT()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any_email@email.com',
      password: 'any password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSUT()
    jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 403 if AddAccount throws an EmailInUseError', async () => {
    const { sut, addAccountStub } = makeSUT()
    jest
      .spyOn(addAccountStub, 'add')
      .mockRejectedValueOnce(new EmailInUseError())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSUT()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSUT()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    )
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSUT()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com',
      password: 'any password'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSUT()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
