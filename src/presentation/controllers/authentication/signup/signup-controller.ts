import { EmailInUseError } from '@presentation/errors'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '@presentation/helpers/http/http-helper'
import { Validation } from '@presentation/protocols'
import {
  AddAccount,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      await this.addAccount.add({
        name,
        email,
        password
      })
      const authenticationModel = await this.authentication.auth({
        email,
        password
      })
      return ok(authenticationModel)
    } catch (error) {
      if (error instanceof EmailInUseError) {
        return forbidden(error)
      }
      return serverError(error)
    }
  }
}
