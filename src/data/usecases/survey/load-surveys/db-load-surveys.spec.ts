import { LoadSurveysRepositorySpy } from '@data/test/mock-db-survey'
import { mockSurveysModel, throwError } from '@domain/test'
import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'

type SUTTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSUT = (): SUTTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSUT()
    await sut.load()
    expect(loadSurveysRepositorySpy.callCount).toEqual(1)
  })

  test('Should return a list of surveys on success', async () => {
    const { sut } = makeSUT()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveysModel())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSUT()
    loadSurveysRepositorySpy.loadAll = throwError
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
