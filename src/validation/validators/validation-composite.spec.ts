import { MissingParamError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { mockValidation } from '@validation/test'
import { ValidationComposite } from './validation-composite'

interface SuTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSUT = (): SuTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(...validationStubs)
  return { validationStubs, sut }
}

describe('ValidationComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSUT()
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSUT()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({})
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSUT()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeUndefined()
  })
})
