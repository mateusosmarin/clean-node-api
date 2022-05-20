import { LogErrorRepository } from '@data/protocols/db/log/log-error-repository'
import { mockLogErrorRepository } from '@data/test'
import { mockAccountModel } from '@domain/test'
import { ok, serverError } from '@presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

type SUTTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
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

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return ok(mockAccountModel())
    }
  }
  return new ControllerStub()
}

const makeSUT = (): SUTTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  )
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSUT()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(mockRequest())
    expect(handleSpy).toHaveBeenCalledWith(mockRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockAccountModel()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSUT()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValueOnce(mockServerError())
    await sut.handle(mockRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
