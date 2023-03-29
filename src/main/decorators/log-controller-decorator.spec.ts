import { LogErrorRepositorySpy } from '@data/test'
import { mockAccountModel } from '@domain/test'
import { faker } from '@faker-js/faker'
import { ok, serverError } from '@presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

type SUTTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
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

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = faker.random.words()
  return serverError(fakeError)
}

class ControllerSpy implements Controller {
  httpRequest: HttpRequest
  httpResponse: HttpResponse = ok(mockAccountModel())

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return this.httpResponse
  }
}

const makeSUT = (): SUTTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSUT()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(controllerSpy.httpRequest).toEqual(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSUT()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSUT()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError
    await sut.handle(mockRequest())
    expect(logErrorRepositorySpy.stack).toEqual(serverError.body.stack)
  })
})
