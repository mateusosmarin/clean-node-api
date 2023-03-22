import {
  Authentication,
  AuthenticationParams
} from '@domain/usecases/account/authentication'

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  token: string | null = 'any_token'

  async auth (authenticationParams: AuthenticationParams): Promise<string | null> {
    this.authenticationParams = authenticationParams
    return this.token
  }
}
