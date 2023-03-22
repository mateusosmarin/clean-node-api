import {
  Authentication,
  AuthenticationParams
} from '@domain/usecases/account/authentication'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authenticationParams: AuthenticationParams): Promise<string | null> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}
