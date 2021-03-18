import { DbSaveSurveyResults } from '@/data/usecases'
import { LoadSurveyResultRepositorySpy, SaveSurveyResultRepositorySpy } from '@/tests/data/mocks'
import { mockSaveSurveyResultParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbSaveSurveyResults
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResults(saveSurveyResultRepositorySpy, loadSurveyResultRepositorySpy)

  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  }
}

describe('DbSaveSurveyResults', () => {
  test('Should call SaveSurveyResultRepository with a correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(saveSurveyResultRepositorySpy.params).toEqual(surveyData)
  })

  test('Should call LoadSurveyResultRepository with a correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(loadSurveyResultRepositorySpy.params.accountId).toEqual(surveyData.accountId)
    expect(loadSurveyResultRepositorySpy.params.surveyId).toEqual(surveyData.surveyId)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return SaveSurveyRusult if LoadSurveyResultRepository success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const promise = await sut.save(mockSaveSurveyResultParams())
    expect(promise).toEqual(loadSurveyResultRepositorySpy.result)
  })
})
