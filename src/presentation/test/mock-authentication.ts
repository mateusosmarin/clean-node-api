import { AuthenticationModel } from '@domain/models/authentication'
import {
  Authentication,
  AuthenticationParams
} from '@domain/usecases/account/authentication'
import { faker } from '@faker-js/faker'

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel: AuthenticationModel | null = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.firstName()
  }

  async auth (
    authenticationParams: AuthenticationParams
  ): Promise<AuthenticationModel | null> {
    this.authenticationParams = authenticationParams
    return this.authenticationModel
  }
}
