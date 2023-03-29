import {
  mockAddAccountParams,
  mockAuthenticatedAccountModel,
  mockAuthenticatedAdminAccountModel
} from '@domain/test'
import { mongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account-mongo-repository'
import { faker } from '@faker-js/faker'

const makeSUT = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
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

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSUT()
      const addAccountParams = mockAddAccountParams()
      const account = await sut.add(addAccountParams)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSUT()
      const addAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
      expect(account.accessToken).toBeFalsy()
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSUT()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSUT()
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = result.ops[0]
      const token = faker.datatype.uuid()
      await sut.updateAccessToken(fakeAccount._id, token)
      const account = await accountCollection.findOne({
        _id: fakeAccount._id
      })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe(token)
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSUT()
      const authenticatedAccount = mockAuthenticatedAccountModel()
      await accountCollection.insertOne(authenticatedAccount)
      const account = await sut.loadByToken(
        authenticatedAccount.accessToken as string
      )
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(authenticatedAccount.name)
      expect(account.email).toBe(authenticatedAccount.email)
      expect(account.password).toBe(authenticatedAccount.password)
      expect(account.accessToken).toBe(authenticatedAccount.accessToken)
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSUT()
      const authenticatedAccount = mockAuthenticatedAdminAccountModel()
      await accountCollection.insertOne(authenticatedAccount)
      const account = await sut.loadByToken(
        authenticatedAccount.accessToken as string,
        'admin'
      )
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(authenticatedAccount.name)
      expect(account.email).toBe(authenticatedAccount.email)
      expect(account.password).toBe(authenticatedAccount.password)
      expect(account.accessToken).toBe(authenticatedAccount.accessToken)
      expect(account.role).toBe(authenticatedAccount.role)
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSUT()
      const authenticatedModel = mockAuthenticatedAccountModel()
      await accountCollection.insertOne(authenticatedModel)
      const account = await sut.loadByToken(
        authenticatedModel.accessToken as string,
        'admin'
      )
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSUT()
      const authenticatedAccount = mockAuthenticatedAdminAccountModel()
      await accountCollection.insertOne(authenticatedAccount)
      const account = await sut.loadByToken(
        authenticatedAccount.accessToken as string
      )
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(authenticatedAccount.name)
      expect(account.email).toBe(authenticatedAccount.email)
      expect(account.password).toBe(authenticatedAccount.password)
      expect(account.accessToken).toBe(authenticatedAccount.accessToken)
      expect(account.role).toBe(authenticatedAccount.role)
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSUT()
      const token = faker.datatype.uuid()
      const account = await sut.loadByToken(token)
      expect(account).toBeFalsy()
    })
  })
})
