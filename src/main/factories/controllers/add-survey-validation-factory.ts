import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['question', 'answers']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
