import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SuTypes {
  sut: ValidationComposite
  validationStub: Validation
}

const makeSut = (): SuTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite(validationStub)
  return { validationStub, sut }
}

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })
})
