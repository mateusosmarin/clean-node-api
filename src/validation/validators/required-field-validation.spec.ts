import { MissingParamError } from '@presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSUT = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredFieldValidation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSUT()
    const error = sut.validate({
      name: 'any_name'
    })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSUT()
    const error = sut.validate({
      field: 'any_value'
    })
    expect(error).toBeUndefined()
  })
})
