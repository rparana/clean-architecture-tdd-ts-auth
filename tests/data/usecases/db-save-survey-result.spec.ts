import { DbSaveSurveyResults } from '@/data/usecases'
import { SaveSurveyResultRepository } from '@/data/protocols'
import { SaveSurveyResultModel } from '@/domain/usecases'
import Mockdate from 'mockdate'
import { SurveyResultModel } from '@/domain/models'

const makeFakeSaveSurveyResult = (): SaveSurveyResultModel => {
  return {
    surveyId: 'any_Id',
    accountId: 'any_account_Id',
    answer: 'any_answer',
    date: new Date()
  }
}

const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    id: 'any_Id',
    ...makeFakeSaveSurveyResult()
  }
}

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResults
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResults(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResults', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  test('Should call SaveSurveyResultRepository with a correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyData = makeFakeSaveSurveyResult()
    await sut.save(surveyData)
    expect(addSpy).toBeCalledWith(surveyData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.save(makeFakeSaveSurveyResult())
    await expect(promise).rejects.toThrow()
  })

  test('Should return SaveSurveyRusult if SaveSurveyResultRepository success', async () => {
    const { sut } = makeSut()
    const promise = await sut.save(makeFakeSaveSurveyResult())
    expect(promise).toEqual(makeFakeSurveyResult())
  })
})
