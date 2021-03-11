import { LoadSurveyById } from '@/domain/usecases'

export interface LoadSurveyByIdRepository {
  loadById: (surveyId: string) => Promise<LoadSurveyByIdRepository.Result>
}
export namespace LoadSurveyByIdRepository {
  export type Result = LoadSurveyById.Result
}
