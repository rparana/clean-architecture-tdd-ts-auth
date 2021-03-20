import faker from 'faker'
import { AddSurvey, CheckSurveyById, LoadAnswersBySurveyId, LoadSurveys } from '@/domain/usecases'
import { mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  params: AddSurvey.Params
  async add (surveyData: AddSurvey.Params): Promise<void> {
    this.params = surveyData
    return Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  params: string
  result = mockSurveyModels()
  async load (accountId: string): Promise<LoadSurveys.Result> {
    this.params = accountId
    return Promise.resolve(this.result)
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  params: string
  result = true
  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.params = id
    return Promise.resolve(this.result)
  }
}

export class LoadAnswersBySurveyIdSpy implements LoadAnswersBySurveyId {
  params: string
  result = [
    faker.random.words(),
    faker.random.words(),
    faker.random.words(),
    faker.random.words()
  ]

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyId.Result> {
    this.params = id
    return Promise.resolve(this.result)
  }
}
