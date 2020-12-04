import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { EmailValidator } from '../../protocols/email-validator'

export class EmailValidation implements Validation {
  private readonly emailValidator: EmailValidator
  private readonly fieldName: string

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
