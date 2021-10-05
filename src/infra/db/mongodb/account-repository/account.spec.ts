import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL)
    } else {
      throw new Error('MONGO_URL not set')
    }
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any name',
      email: 'any_email@email.com',
      password: 'any password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'any password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any password')
    expect(account.accessToken).toBeFalsy()
  })

  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'any password'
    })
    const fakeAccount = result.ops[0]
    await sut.updateAccessToken(fakeAccount._id, 'any_token')
    const account = await accountCollection.findOne({
      _id: fakeAccount._id
    })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
