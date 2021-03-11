import { SurveyResultModel } from '@/domain/models'
import { AddSurvey, LoadSurveyById, LoadSurveys, SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModels, mockSurveyResultModel } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  params: AddSurvey.Params
  async add (surveyData: AddSurvey.Params): Promise<void> {
    this.params = surveyData
    return Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  callsCount = 0
  result = mockSurveyModels()
  async load (): Promise<LoadSurveys.Result> {
    this.callsCount++
    return Promise.resolve(this.result)
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  params: string
  result = mockSurveyModel()
  async loadById (id: string): Promise<LoadSurveyById.Result> {
    this.params = id
    return Promise.resolve(this.result)
  }
}

export class SaveSurveyResultSpy implements SaveSurveyResult {
  params: SaveSurveyResultParams
  result = mockSurveyResultModel()
  async save (surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.params = surveyData
    return Promise.resolve(this.result)
  }
}
