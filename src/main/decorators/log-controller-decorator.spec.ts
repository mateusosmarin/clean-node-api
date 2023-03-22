import { LogErrorRepositorySpy } from '@data/test'
import { mockAccountModel } from '@domain/test'
import { ok, serverError } from '@presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

type SUTTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any name',
    email: 'any_email@email.com',
    password: 'any password',
    passwordConfirmation: 'any password'
  }
})

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
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
    await sut.handle(mockRequest())
    expect(controllerSpy.httpRequest).toEqual(mockRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockAccountModel()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSUT()
    controllerSpy.httpResponse = mockServerError()
    await sut.handle(mockRequest())
    expect(logErrorRepositorySpy.stack).toEqual('any_stack')
  })
})
