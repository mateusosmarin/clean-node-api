import { Validation } from '@presentation/protocols'

export class ValidationSpy implements Validation {
  input: any
  error?: Error

  validate (input: any): Error | undefined {
    this.input = input
    return this.error
  }
}
