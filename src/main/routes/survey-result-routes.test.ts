import { faker } from '@faker-js/faker'
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
    const result = await accountCollection.insertOne({
      name: 'Mateus',
      email: 'mateus.osmarin@gmail.com',
      password: '123456',
      role: 'admin'
    })
    const id = result.ops[0]._id
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
      const surveyId = faker.datatype.uuid()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .send({
          answer: faker.random.words()
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with access token', async () => {
      const answer = faker.random.words()
      const result = await surveyCollection.insertOne({
        question: faker.random.words(),
        answers: [
          {
            answer,
            image: faker.image.imageUrl()
          },
          {
            answer: faker.random.words(),
            image: faker.image.imageUrl()
          }
        ],
        date: faker.date.recent()
      })
      const surveyId = String(result.ops[0]._id)
      const accessToken = await makeAccessToken()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without access token', async () => {
      const surveyId = faker.datatype.uuid()
      await request(app).get(`/api/surveys/${surveyId}/results`).expect(403)
    })

    test('Should return 200 on load survey result with access token', async () => {
      const result = await surveyCollection.insertOne({
        question: faker.random.words(),
        answers: [
          {
            answer: faker.random.words(),
            image: faker.image.imageUrl()
          },
          {
            answer: faker.random.words(),
            image: faker.image.imageUrl()
          }
        ],
        date: faker.date.recent()
      })
      const surveyId = String(result.ops[0]._id)
      const accessToken = await makeAccessToken()
      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
