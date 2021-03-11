import faker from 'faker'
import { SurveyResultModel } from '../models'
import { SaveSurveyResult } from '../usecases'

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => {
  return {
    surveyId: faker.random.uuid(),
    accountId: faker.random.uuid(),
    answer: faker.random.words(),
    date: faker.date.recent()
  }
}

export const mockSurveyResultModel = (): SurveyResultModel => {
  return {
    id: faker.random.uuid(),
    ...mockSaveSurveyResultParams()
  }
}
