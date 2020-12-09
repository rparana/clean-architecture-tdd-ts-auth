import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('first_field', 'second_field')
}

describe('Compare Fields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ first_field: 'any_value', second_field: 'wrong_value' })
    expect(error).toEqual(new InvalidParamError('second_field'))
  })

  test('Should not return validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ first_field: 'any_value', second_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
