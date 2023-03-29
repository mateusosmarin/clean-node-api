import { LoadSurveyByIdRepositorySpy } from '@data/test/mock-db-survey'
import { throwError } from '@domain/test'
import { faker } from '@faker-js/faker'
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

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSUT()
    await sut.loadById(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toEqual(surveyId)
  })

  test('Should return a survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSUT()
    const surveys = await sut.loadById(surveyId)
    expect(surveys).toEqual(loadSurveyByIdRepositorySpy.surveyModel)
  })

  test('Should throw if LoadSurveyByRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSUT()
    loadSurveyByIdRepositorySpy.loadById = throwError
    const promise = sut.loadById(surveyId)
    await expect(promise).rejects.toThrow()
  })
})
