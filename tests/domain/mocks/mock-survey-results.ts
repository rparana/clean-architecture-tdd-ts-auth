import faker from 'faker'
import { SurveyResultModel } from '../models'
import { SaveSurveyResultParams } from '../usecases'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => {
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
