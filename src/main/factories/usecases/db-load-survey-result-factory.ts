import { SurveyMongoRepository, SurveyResultMongoRepository } from '@/infra/db/mongodb'
import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResult } from '@/domain/usecases'

export const makeDbLoadSurveyResuts = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const loadSurveyById = new SurveyMongoRepository()
  return new DbLoadSurveyResult(surveyResultMongoRepository, loadSurveyById)
}
