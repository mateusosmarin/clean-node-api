import { EmailValidatorAdapter } from '@infra/validators/email-validator-adapter'
import { Validation } from '@presentation/protocols'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@validation/validators'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('@validation/validators/validation-composite')

describe('SigUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation'
    ]
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(...validations)
  })
})
