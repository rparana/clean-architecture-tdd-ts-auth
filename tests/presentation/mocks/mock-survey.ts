import { SurveyModel, SurveyResultModel } from '@/domain/models'
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
  async load (): Promise<SurveyModel[]> {
    this.callsCount++
    return Promise.resolve(this.result)
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  params: string
  result = mockSurveyModel()
  async loadById (id: string): Promise<SurveyModel> {
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
