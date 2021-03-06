import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { mongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import app from '@main/config/app'

describe('Authentication Routes', () => {
  let accountCollection: Collection

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
    accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Mateus',
          email: 'mateus.osmarin@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Mateus',
        email: 'mateus.osmarin@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'mateus.osmarin@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login failure', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'mateus.osmarin@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
