import { AccountModel } from '@domain/models/account'
import { SurveyModel } from '@domain/models/survey'
import { faker } from '@faker-js/faker'
import { mongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

const makeSUT = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('SurveyResult Mongo Repository', () => {
  let surveyCollection: Collection
  let surveyResultCollection: Collection
  let accountCollection: Collection

  const makeSurvey = async (): Promise<SurveyModel> => {
    const result = await surveyCollection.insertOne({
      question: faker.random.words(),
      answers: [
        {
          image: faker.image.imageUrl(),
          answer: faker.random.words()
        },
        {
          answer: faker.random.words()
        }
      ],
      date: new Date()
    })
    return mongoHelper.map(result.ops[0])
  }

  const makeAccount = async (): Promise<AccountModel> => {
    const result = await accountCollection.insertOne({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
    return mongoHelper.map(result.ops[0])
  }

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
    surveyResultCollection = await mongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if it is new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSUT()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update survey result if it is not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSUT()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      const surveyResults = await surveyResultCollection
        .find({
          surveyId: survey.id,
          accountId: account.id
        })
        .toArray()
      expect(surveyResults).toBeTruthy()
      expect(surveyResults.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const sut = makeSUT()
      const surveyResult = await sut.loadBySurveyId(survey.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].count).toEqual(2)
      expect(surveyResult?.answers[0].percent).toEqual(50)
      expect(surveyResult?.answers[1].count).toEqual(2)
      expect(surveyResult?.answers[1].percent).toEqual(50)
    })

    test('Should return null if there is no survey result', async () => {
      const survey = await makeSurvey()
      const sut = makeSUT()
      const surveyResult = await sut.loadBySurveyId(survey.id)
      expect(surveyResult).toBeNull()
    })
  })
})
