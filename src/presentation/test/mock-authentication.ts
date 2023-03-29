import {
  Authentication,
  AuthenticationParams
} from '@domain/usecases/account/authentication'
import { faker } from '@faker-js/faker'

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  token: string | null = faker.datatype.uuid()

  async auth (
    authenticationParams: AuthenticationParams
  ): Promise<string | null> {
    this.authenticationParams = authenticationParams
    return this.token
  }
}
