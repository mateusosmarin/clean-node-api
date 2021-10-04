import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error | undefined {
    const email = input[this.fieldName]
    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}