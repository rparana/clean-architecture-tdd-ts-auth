import { SurveyResultMongoRepository } from '@/infra/db/mongodb'
import { DbSaveSurveyResults } from '@/data/usecases'
import { SaveSurveyResult } from '@/domain/usecases'

export const makeDbSaveSurveyResuts = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResults(surveyResultMongoRepository)
}
