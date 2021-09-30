import { InvalidParamError, MissingParamError } from '../../errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  Authentication
} from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }
      const token = await this.authentication.auth(email, password)
      if (token == null) {
        return unauthorized()
      }
      return ok({})
    } catch (error) {
      return serverError(new Error())
    }
  }
}
