import { throwError } from '@domain/test'
import { faker } from '@faker-js/faker'
import { MissingParamError } from '@presentation/errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@presentation/helpers/http/http-helper'
import { AuthenticationSpy, ValidationSpy } from '@presentation/test'
import { LoginController } from './login-controller'
import { HttpRequest } from './login-controller-protocols'

type SUTTypes = {
  sut: LoginController
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSUT = (): SUTTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy
  }
}

const mockRequest = (): HttpRequest => ({
  body: {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
})

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSUT()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSUT()
    authenticationSpy.token = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSUT()
    authenticationSpy.auth = throwError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSUT()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: authenticationSpy.token }))
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
})
