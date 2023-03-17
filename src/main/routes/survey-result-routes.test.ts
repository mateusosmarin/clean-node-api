import { mongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import app from '@main/config/app'
import env from '@main/config/env'
import jwt from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

describe('Survey Result Routes', () => {
  let surveyCollection: Collection
  let accountCollection: Collection

  const makeAccessToken = async (): Promise<string> => {
    const res = await accountCollection.insertOne({
      name: 'Mateus',
      email: 'mateus.osmarin@gmail.com',
      password: '123456',
      role: 'admin'
    })
    const id = res.ops[0]._id
    const accessToken = jwt.sign({ id }, env.jwtSecret)
    await accountCollection.updateOne(
      {
        _id: id
      },
      {
        $set: {
          accessToken
        }
      }
    )
    return accessToken
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

    accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with access token', async () => {
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2',
            image: 'http://image-name.com'
          }
        ],
        date: new Date()
      })
      const accessToken = await makeAccessToken()
      await request(app)
        .put(`/api/surveys/${String(res.ops[0]._id)}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without access token', async () => {
      await request(app).get('/api/surveys/any_id/results').expect(403)
    })

    test('Should return 200 on load survey result with access token', async () => {
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [
          {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          },
          {
            answer: 'Answer 2',
            image: 'http://image-name.com'
          }
        ],
        date: new Date()
      })
      const accessToken = await makeAccessToken()
      await request(app)
        .get(`/api/surveys/${String(res.ops[0]._id)}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
