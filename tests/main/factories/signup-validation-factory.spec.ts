import { Validation } from '@/presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite, CompareFieldsValidation, EmailValidation } from '@/validation/validators'
import { makeSignupValidation } from '@/main/factories/controllers'
import { EmailValidator } from '@/validation/protocols/email-validator'

jest.mock('@/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (_: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()
    const validations: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
