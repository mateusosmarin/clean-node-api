import { LoadSurveyByIdRepositorySpy } from '@data/test/mock-db-survey'
import { mockSurveyModel, throwError } from '@domain/test'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'

type SUTTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSUT = (): SUTTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSUT()
    await sut.loadById('any_id')
    expect(loadSurveyByIdRepositorySpy.id).toEqual('any_id')
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSUT()
    const surveys = await sut.loadById('any_id')
    expect(surveys).toEqual(mockSurveyModel())
  })

  test('Should throw if LoadSurveyByRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSUT()
    loadSurveyByIdRepositorySpy.loadById = throwError
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
