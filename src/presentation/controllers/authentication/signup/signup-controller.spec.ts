import { throwError } from '@domain/test'
import { faker } from '@faker-js/faker'
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
import { HttpRequest } from '@presentation/protocols'
import {
  AddAccountSpy,
  AuthenticationSpy,
  ValidationSpy
} from '@presentation/test'
import { SignUpController } from './signup-controller'

type SUTTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}

const makeSUT = (): SUTTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(
    addAccountSpy,
    validationSpy,
    authenticationSpy
  )
  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('Signup Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSUT()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addAccountSpy.addAccountParams).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSUT()
    addAccountSpy.add = throwError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 403 if AddAccount throws an EmailInUseError', async () => {
    const { sut, addAccountSpy } = makeSUT()
    addAccountSpy.add = async () => await Promise.reject(new EmailInUseError())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSUT()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSUT()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSUT()
    const field = faker.random.word()
    validationSpy.error = new MissingParamError(field)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError(field)))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSUT()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSUT()
    authenticationSpy.auth = throwError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
