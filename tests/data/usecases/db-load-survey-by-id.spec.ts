import { DbLoadSurveyById } from '@/data/usecases'
import { mockSurveyModel, throwError } from '@/tests/domain/mocks'
import { LoadSurveyByIdRepositorySpy } from '../mocks'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyById', () => {
  test('Should DbLoadSurveyById call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const survey = mockSurveyModel()
    await sut.loadById(survey.id)
    expect(loadSurveyByIdRepositorySpy.surveyId).toBe(survey.id)
  })

  test('Should DbLoadSurveyById return null if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.result = null
    const result = await sut.loadById(mockSurveyModel().id)
    expect(result).toBeNull()
  })

  test('Should DbLoadSurveyById throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadById(mockSurveyModel().id)
    await expect(promise).rejects.toThrow()
  })

  test('Should DbLoadSurveyById return correct values if LoadSurveyRepository success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const promise = await sut.loadById(mockSurveyModel().id)
    expect(promise).toEqual(loadSurveyByIdRepositorySpy.result)
  })
})
