import { DbSaveSurveyResults } from '@/data/usecases'
import { SaveSurveyResultRepositorySpy } from '../mocks/mock-db-save-survey-results'
import { mockSaveSurveyResultParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbSaveSurveyResults
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResults(saveSurveyResultRepositorySpy)

  return {
    sut,
    saveSurveyResultRepositorySpy
  }
}

describe('DbSaveSurveyResults', () => {
  test('Should call SaveSurveyResultRepository with a correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(saveSurveyResultRepositorySpy.params).toEqual(surveyData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return SaveSurveyRusult if SaveSurveyResultRepository success', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const promise = await sut.save(mockSaveSurveyResultParams())
    expect(promise).toEqual(saveSurveyResultRepositorySpy.result)
  })
})
