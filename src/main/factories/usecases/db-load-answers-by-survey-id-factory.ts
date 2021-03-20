import { SurveyMongoRepository } from '@/infra/db/mongodb'
import { DbLoadAnswersBySurveyId } from '@/data/usecases'
import { LoadAnswersBySurveyId } from '@/domain/usecases'

export const makeDbLoadAnswersBySurveyId = (): LoadAnswersBySurveyId => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadAnswersBySurveyId(surveyMongoRepository)
}
