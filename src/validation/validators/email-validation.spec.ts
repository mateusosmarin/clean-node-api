import { throwError } from '@domain/test'
import { InvalidParamError } from '@presentation/errors'
import { EmailValidatorSpy } from '@validation/test'
import { EmailValidation } from './email-validation'

type SUTTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

const makeSUT = (): SUTTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

describe('EmailValidation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSUT()
    emailValidatorSpy.isEmailValid = false
    const error = sut.validate({
      email: 'any_email@mail.com'
    })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSUT()
    sut.validate({
      email: 'any_email@mail.com'
    })
    expect(emailValidatorSpy.email).toEqual('any_email@mail.com')
  })

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorSpy } = makeSUT()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError)
    expect(sut.validate).toThrow()
  })
})
