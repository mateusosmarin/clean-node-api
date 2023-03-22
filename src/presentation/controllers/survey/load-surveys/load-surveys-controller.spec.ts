import { mockSurveysModel, throwError } from '@domain/test'
import {
  noContent,
  ok,
  serverError
} from '@presentation/helpers/http/http-helper'
import { LoadSurveysSpy } from '@presentation/test'
import MockDate from 'mockdate'
import { LoadSurveysController } from './load-surveys-controller'

type SUTTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}

const makeSUT = (): SUTTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveysController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call loadSurveys', async () => {
    const { sut, loadSurveysSpy } = makeSUT()
    await sut.handle({})
    expect(loadSurveysSpy.callCount).toEqual(1)
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveysModel()))
  })

  test('Should return 204 if there are no surveys', async () => {
    const { sut, loadSurveysSpy } = makeSUT()
    loadSurveysSpy.surveysModel = []
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSUT()
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
