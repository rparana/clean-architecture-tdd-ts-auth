import { SurveyMongoRepository } from '@/infra/db/mongodb'
import { DbLoadSurveyById } from '@/data/usecases'
import { LoadSurveyById } from '@/domain/usecases'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
