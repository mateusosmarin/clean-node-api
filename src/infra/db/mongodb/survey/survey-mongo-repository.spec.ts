import { mockAddSurveyParams } from '@domain/test'
import { mongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeSUT = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await mongoHelper.connect(process.env.MONGO_URL)
    } else {
      throw new Error('MONGO_URL not set')
    }
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSUT()
      const addSurveyModel = mockAddSurveyParams()
      await sut.add(addSurveyModel)
      const survey = await surveyCollection.findOne({
        question: addSurveyModel.question
      })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const sut = makeSUT()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      await surveyCollection.insertMany(addSurveyModels)
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].id).toBeTruthy()
    })

    test('Should load empty list', async () => {
      const sut = makeSUT()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const result = await surveyCollection.insertOne(mockAddSurveyParams())
      const surveyId = result.ops[0]._id
      const sut = makeSUT()
      const survey = await sut.loadById(surveyId)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
