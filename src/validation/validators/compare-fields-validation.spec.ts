import { faker } from '@faker-js/faker'
import { InvalidParamError } from '@presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const field = faker.random.word()
const fieldToCompare = faker.random.word()

const makeSUT = (): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFieldsValidation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSUT()
    const error = sut.validate({
      [field]: faker.random.word(),
      [fieldToCompare]: faker.random.word()
    })
    expect(error).toEqual(new InvalidParamError(fieldToCompare))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSUT()
    const value = faker.random.word()
    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value
    })
    expect(error).toBeUndefined()
  })
})
