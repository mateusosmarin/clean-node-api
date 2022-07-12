import { AccountModel } from '@domain/models/account'
import { SurveyModel } from '@domain/models/survey'
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
    const res = await surveyCollection.insertOne({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          image: 'other_image',
          answer: 'other_answer'
        }
      ],
      date: new Date()
    })
    return mongoHelper.map(res.ops[0])
  }

  const makeAccount = async (): Promise<AccountModel> => {
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    return mongoHelper.map(res.ops[0])
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
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toEqual(1)
      expect(surveyResult.answers[0].percent).toEqual(100)
      expect(surveyResult.answers[0].answer).toEqual(survey.answers[0].answer)
      expect(surveyResult.answers[1].count).toEqual(0)
      expect(surveyResult.answers[1].percent).toEqual(0)
      expect(surveyResult.answers[1].answer).toEqual(survey.answers[1].answer)
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
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toEqual(1)
      expect(surveyResult.answers[0].percent).toEqual(100)
      expect(surveyResult.answers[0].answer).toEqual(survey.answers[1].answer)
      expect(surveyResult.answers[1].count).toEqual(0)
      expect(surveyResult.answers[1].percent).toEqual(0)
      expect(surveyResult.answers[1].answer).toEqual(survey.answers[0].answer)
    })
  })
})
