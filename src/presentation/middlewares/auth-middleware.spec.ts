import { throwError } from '@domain/test'
import { faker } from '@faker-js/faker'
import { AccessDeniedError } from '@presentation/errors'
import {
  forbidden,
  ok,
  serverError
} from '@presentation/helpers/http/http-helper'
import { LoadAccountByTokenSpy } from '@presentation/test'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from './auth-middleware-protocols'

type SUTTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSUT = (role?: string): SUTTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return {
    sut,
    loadAccountByTokenSpy
  }
}

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': faker.datatype.uuid()
  }
})

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = faker.random.word()
    const { sut, loadAccountByTokenSpy } = makeSUT(role)
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy.accessToken).toEqual(
      httpRequest.headers['x-access-token']
    )
    expect(loadAccountByTokenSpy.role).toEqual(role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSUT()
    loadAccountByTokenSpy.accountModel = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSUT()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(
      ok({ accountId: loadAccountByTokenSpy.accountModel?.id })
    )
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSUT()
    loadAccountByTokenSpy.load = throwError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
