import { InvalidParamError } from '@presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSUT = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFieldsValidation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSUT()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'another_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSUT()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(error).toBeUndefined()
  })
})
