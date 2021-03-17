import faker from 'faker'
import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResultRepositorySpy } from '../mocks'
import { throwError } from '@/tests/domain/mocks'

const mockSurveyId = faker.random.uuid()
const mockAccountId = faker.random.uuid()

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy)
  return {
    sut,
    loadSurveyResultRepositorySpy
  }
}

describe('DbLoadSurveyResults UseCase', () => {
  test('Should call LoadSurveyResultRepository with correct value', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    await sut.load(mockSurveyId, mockAccountId)
    expect(loadSurveyResultRepositorySpy.params.surveyId).toEqual(mockSurveyId)
    expect(loadSurveyResultRepositorySpy.params.accountId).toEqual(mockAccountId)
  })

  test('Should throws if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load(mockSurveyId, mockAccountId)
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadSurveyResultRepository return null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.result = null
    await sut.load(mockSurveyId, mockAccountId)
    expect(loadSurveyResultRepositorySpy.params.surveyId).toEqual(mockSurveyId)
    expect(loadSurveyResultRepositorySpy.params.accountId).toEqual(mockAccountId)
  })

  test('Should return surveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const result = await sut.load(mockSurveyId, mockAccountId)
    expect(result).toEqual(loadSurveyResultRepositorySpy.result)
  })
})
