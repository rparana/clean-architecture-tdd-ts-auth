import faker from 'faker'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult } from '@/domain/usecases'

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
    surveyId: faker.random.uuid(),
    question: faker.random.words(),
    answers: [{
      answer: faker.random.words(),
      image: faker.image.imageUrl(),
      count: faker.random.number(),
      percent: faker.random.number(100)
    }],
    date: faker.date.recent()
  }
}
