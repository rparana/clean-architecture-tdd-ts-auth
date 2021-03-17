import faker from 'faker'
import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResultRepositorySpy } from '../mocks'

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
})
