import { EmailValidator } from '@validation/protocols/email-validator'
import { Validation } from '@presentation/protocols'
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@validation/validators'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('@validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(...validations)
  })
})
