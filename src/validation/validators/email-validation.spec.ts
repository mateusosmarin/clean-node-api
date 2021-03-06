import { InvalidParamError } from '@presentation/errors'
import { EmailValidator } from '@validation/protocols/email-validator'
import { mockEmailValidator } from '@validation/test'
import { EmailValidation } from './email-validation'

type SUTTypes = {
  emailValidatorStub: EmailValidator
  sut: EmailValidation
}

const makeSUT = (): SUTTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    emailValidatorStub,
    sut
  }
}

describe('EmailValidation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSUT()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({
      email: 'any_email@mail.com'
    })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSUT()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({
      email: 'any_email@mail.com'
    })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSUT()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
