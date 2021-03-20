import { DbCheckSurveyById } from '@/data/usecases'
import { mockSurveyModel, throwError } from '@/tests/domain/mocks'
import { CheckSurveyByIdRepositorySpy } from '../mocks'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)

  return {
    sut,
    checkSurveyByIdRepositorySpy
  }
}

describe('DbCheckSurveyById', () => {
  test('Should DbCheckSurveyById call CheckSurveyByIdRepository with correct value', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    const survey = mockSurveyModel()
    await sut.checkById(survey.id)
    expect(checkSurveyByIdRepositorySpy.id).toBe(survey.id)
  })

  test('Should DbCheckSurveyById return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    checkSurveyByIdRepositorySpy.result = true
    const result = await sut.checkById(mockSurveyModel().id)
    expect(result).toBe(true)
  })

  test('Should DbCheckSurveyById throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockImplementationOnce(throwError)
    const exists = sut.checkById(mockSurveyModel().id)
    await expect(exists).rejects.toThrow()
  })

  test('Should DbCheckSurveyById return false values if CheckSurveyByIdRepository return false', async () => {
    const { sut } = makeSut()
    const exists = await sut.checkById(mockSurveyModel().id)
    expect(exists).toBe(false)
  })
})
