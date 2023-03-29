import { throwError } from '@domain/test'
import { faker } from '@faker-js/faker'
import { InvalidParamError } from '@presentation/errors'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@presentation/test'
import MockDate from 'mockdate'
import { LoadSurveyResultController } from './load-survey-result-controller'
import {
  forbidden,
  HttpRequest,
  ok,
  serverError
} from './load-survey-result-controller-protocols'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: faker.datatype.uuid()
  }
})

type SUTTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSUT = (): SUTTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  )
  return { sut, loadSurveyByIdSpy, loadSurveyResultSpy }
}

describe('LoadSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdSpy } = makeSUT()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveyByIdSpy.id).toEqual(httpRequest.params.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSUT()
    loadSurveyByIdSpy.surveyModel = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSUT()
    loadSurveyByIdSpy.loadById = throwError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultSpy } = makeSUT()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveyResultSpy.surveyId).toEqual(httpRequest.params.surveyId)
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSUT()
    loadSurveyResultSpy.load = throwError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSUT()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.surveyResultModel))
  })
})
