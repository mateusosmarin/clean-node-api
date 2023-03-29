import { LoadSurveyResultRepositorySpy } from '@data/test'
import { LoadSurveyByIdRepositorySpy } from '@data/test/mock-db-survey'
import { throwError } from '@domain/test'
import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'
import { DbLoadSurveyResult } from './db-load-survey-result'

type SUTTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSUT = (): SUTTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  )
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  let surveyId: string

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSUT()
    await sut.load(surveyId)
    expect(loadSurveyResultRepositorySpy.surveyId).toEqual(surveyId)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSUT()
    loadSurveyResultRepositorySpy.loadBySurveyId = throwError
    const promise = sut.load(surveyId)
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSUT()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    await sut.load(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toEqual(surveyId)
  })

  test('Should return a SurveyResult with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSUT()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    const surveyResult = await sut.load(surveyId)
    const { surveyModel } = loadSurveyByIdRepositorySpy
    expect(surveyResult).toEqual({
      surveyId: surveyModel.id,
      question: surveyModel.question,
      date: surveyModel.date,
      answers: surveyModel.answers.map((answer) =>
        Object.assign({}, answer, { count: 0, percent: 0 })
      )
    })
  })

  test('Should return a SurveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSUT()
    const surveyResult = await sut.load(surveyId)
    expect(surveyResult).toEqual(
      loadSurveyResultRepositorySpy.surveyResultModel
    )
  })
})
