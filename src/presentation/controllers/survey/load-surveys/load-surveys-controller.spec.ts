import { mockSurveysModel, throwError } from '@domain/test'
import {
  noContent,
  ok,
  serverError
} from '@presentation/helpers/http/http-helper'
import { mockLoadSurveys } from '@presentation/test'
import MockDate from 'mockdate'
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys } from './load-surveys-controller-protocols'

type SUTTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSUT = (): SUTTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveysController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call loadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSUT()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveysModel()))
  })

  test('should return 204 if there are no surveys', async () => {
    const { sut, loadSurveysStub } = makeSUT()
    jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('should return 500 if LoadSurveysStub throws', async () => {
    const { sut, loadSurveysStub } = makeSUT()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
