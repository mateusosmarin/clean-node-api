import { faker } from '@faker-js/faker'
import { MissingParamError } from '@presentation/errors'
import { ValidationSpy } from '@validation/test'
import { ValidationComposite } from './validation-composite'

interface SuTypes {
  sut: ValidationComposite
  validationSpies: ValidationSpy[]
}

const makeSUT = (): SuTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidationComposite(...validationSpies)
  return { validationSpies: validationSpies, sut }
}

describe('ValidationComposite', () => {
  let field: string

  beforeEach(() => {
    field = faker.random.word()
  })

  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSUT()
    validationSpies[0].error = new MissingParamError(field)
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError(field))
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSUT()
    validationSpies[0].error = new Error()
    validationSpies[1].error = new MissingParamError(field)
    const error = sut.validate({})
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSUT()
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toBeUndefined()
  })
})
