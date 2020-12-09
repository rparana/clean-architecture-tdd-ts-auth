import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeSignupValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
