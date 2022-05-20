import { throwError } from '@domain/test'
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
import {
  mockAddAccount,
  mockAuthentication,
  mockValidation
} from '@presentation/test'
import { SignUpController } from './signup-controller'
import { AddAccount, Authentication } from './signup-controller-protocols'

type SUTTypes = {
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
  sut: SignUpController
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeSUT = (): SUTTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
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
    await sut.handle(mockRequest())
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSUT()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 403 if AddAccount throws an EmailInUseError', async () => {
    const { sut, addAccountStub } = makeSUT()
    jest
      .spyOn(addAccountStub, 'add')
      .mockRejectedValueOnce(new EmailInUseError())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSUT()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSUT()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    )
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSUT()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSUT()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
