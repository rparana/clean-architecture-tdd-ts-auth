import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  params: SaveSurveyResultRepository.Params
  result = mockSurveyResultModel()
  async save (data: SaveSurveyResultRepository.Params): Promise<void> {
    this.params = data
    return Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  params: {
    surveyId: string
    accountId: string
  }

  result = mockSurveyResultModel()
  async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
    this.params = { surveyId, accountId }
    return Promise.resolve(this.result)
  }
}
