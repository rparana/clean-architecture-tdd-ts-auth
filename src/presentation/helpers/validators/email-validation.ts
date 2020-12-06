import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { EmailValidator } from '../../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator) {}

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
