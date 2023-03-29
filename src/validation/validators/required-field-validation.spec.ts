import { faker } from '@faker-js/faker'
import { MissingParamError } from '@presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const field = faker.random.word()

const makeSUT = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field)
}

describe('RequiredFieldValidation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSUT()
    const error = sut.validate({
      invalidField: faker.random.word()
    })
    expect(error).toEqual(new MissingParamError(field))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSUT()
    const error = sut.validate({
      [field]: faker.random.word()
    })
    expect(error).toBeUndefined()
  })
})
