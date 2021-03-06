import { SurveyMongoRepository } from '@/infra/db/mongodb'
import { DbLoadSurveys } from '@/data/usecases'
import { LoadSurveys } from '@/domain/usecases/load-surveys'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
