import { throwError } from '@domain/test'
import { faker } from '@faker-js/faker'
import { InvalidParamError } from '@presentation/errors'
import {
  forbidden,
  ok,
  serverError
} from '@presentation/helpers/http/http-helper'
import { LoadSurveyByIdSpy, SaveSurveyResultSpy } from '@presentation/test'
import MockDate from 'mockdate'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest } from './save-survey-result-controller-protocols'

type SUTTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSUT = (): SUTTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  )
  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  }
}

const mockRequest = (answer: string | null = null): HttpRequest => ({
  params: {
    surveyId: faker.datatype.uuid()
  },
  body: {
    answer: answer
  },
  accountId: faker.datatype.uuid()
})

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
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

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSUT()
    const httpRequest = mockRequest(
      loadSurveyByIdSpy.surveyModel?.answers[0].answer
    )
    await sut.handle(httpRequest)
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      answer: httpRequest.body.answer,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSUT()
    saveSurveyResultSpy.save = throwError
    const httpResponse = await sut.handle(
      mockRequest(loadSurveyByIdSpy.surveyModel?.answers[0].answer)
    )
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSUT()
    const httpResponse = await sut.handle(
      mockRequest(loadSurveyByIdSpy.surveyModel?.answers[0].answer)
    )
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel))
  })
})
