import { InvalidParamError } from '@presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { Validation } from '@presentation/protocols'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | undefined {
    const email = input[this.fieldName]
    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
