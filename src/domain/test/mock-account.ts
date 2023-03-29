import { AccountModel } from '@domain/models/account'
import { AddAccountParams } from '@domain/usecases/account/add-account'
import { AuthenticationParams } from '@domain/usecases/account/authentication'
import { faker } from '@faker-js/faker'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel => ({
  id: faker.datatype.uuid(),
  ...mockAddAccountParams()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticatedAccountModel = (): AccountModel => ({
  ...mockAccountModel(),
  accessToken: faker.datatype.uuid()
})

export const mockAuthenticatedAdminAccountModel = (): AccountModel => ({
  ...mockAuthenticatedAccountModel(),
  role: 'admin'
})
