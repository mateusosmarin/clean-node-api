import {
  LoadSurveyResultRepositorySpy,
  SaveSurveyResultRepositorySpy
} from '@data/test'
import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel,
  throwError
} from '@domain/test'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'

type SUTTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSUT = (): SUTTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  )
  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSUT()
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(saveSurveyResultRepositorySpy.saveSurveyResultParams).toEqual(
      mockSaveSurveyResultParams()
    )
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSUT()
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(loadSurveyResultRepositorySpy.surveyId).toEqual(surveyData.surveyId)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSUT()
    saveSurveyResultRepositorySpy.save = throwError
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSUT()
    loadSurveyResultRepositorySpy.loadBySurveyId = throwError
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSUT()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSUT()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
