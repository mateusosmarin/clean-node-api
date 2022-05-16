import { Collection } from 'mongodb'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

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

  describe('add()', () => {
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
  })

  describe('loadByEmail()', () => {
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
  })

  describe('updateAccessToken()', () => {
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

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any password')
      expect(account.accessToken).toBe('any_token')
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any password')
      expect(account.accessToken).toBe('any_token')
      expect(account.role).toBe('admin')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any password',
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any password')
      expect(account.accessToken).toBe('any_token')
      expect(account.role).toBe('admin')
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
