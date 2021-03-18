import faker from 'faker'
import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '../mocks'
import { throwError } from '@/tests/domain/mocks'

const mockSurveyId = faker.random.uuid()
const mockAccountId = faker.random.uuid()

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
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

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository return null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.result = null
    await sut.load(mockSurveyId, mockAccountId)
    expect(loadSurveyByIdRepositorySpy.surveyId).toEqual(mockSurveyId)
  })

  test('Should return surveyResultModel with all answers with count and percent 0 if LoadSurveyResultRepository return null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.result = null
    const result = await sut.load(mockSurveyId, mockAccountId)
    expect(result).toBeTruthy()
    expect(result.answers).toBeTruthy()
    expect(result.answers[0].count).toBe(0)
    expect(result.answers[0].percent).toBe(0)
    expect(result.answers[1].count).toBe(0)
    expect(result.answers[1].percent).toBe(0)
    expect(result.answers[2].count).toBe(0)
    expect(result.answers[2].percent).toBe(0)
  })

  test('Should return surveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const result = await sut.load(mockSurveyId, mockAccountId)
    expect(result).toEqual(loadSurveyResultRepositorySpy.result)
  })
})
