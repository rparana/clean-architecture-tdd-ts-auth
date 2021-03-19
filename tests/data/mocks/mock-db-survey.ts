import { SurveyModel } from '@/domain/models'
import { AddSurvey } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'
import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '../protocols'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurvey.Params
  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    return Promise.resolve()
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result = mockSurveyModel()
  surveyId: string

  async loadById (surveyId: string): Promise<SurveyModel> {
    this.surveyId = surveyId
    return Promise.resolve(this.result)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  params: string
  results = mockSurveyModels()
  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.params = accountId
    return Promise.resolve(this.results)
  }
}
