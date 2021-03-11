import faker from 'faker'
import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/validation/validators/required-field-validation'

const field = faker.random.word()

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field)
}

describe('Required Field Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError(field))
  })

  test('Should not return validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ [field]: faker.random.words() })
    expect(error).toBeFalsy()
  })
})
