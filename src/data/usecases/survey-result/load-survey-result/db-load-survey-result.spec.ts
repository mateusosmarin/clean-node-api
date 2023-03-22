import { LoadSurveyResultRepositorySpy } from '@data/test'
import { LoadSurveyByIdRepositorySpy } from '@data/test/mock-db-survey'
import {
  mockEmptySurveyResultModel,
  mockSurveyResultModel,
  throwError
} from '@domain/test'
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
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSUT()
    await sut.load('any_survey_id')
    expect(loadSurveyResultRepositorySpy.surveyId).toEqual('any_survey_id')
  })

  test('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSUT()
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  test('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSUT()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    await sut.load('any_survey_id')
    expect(loadSurveyByIdRepositorySpy.id).toEqual('any_survey_id')
  })

  test('should return a SurveyResult with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSUT()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    const surveyResult = await sut.load('any_id')
    expect(surveyResult).toEqual(mockEmptySurveyResultModel())
  })

  test('should return a SurveyResult on success', async () => {
    const { sut } = makeSUT()
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
