import { LoadSurveys } from '@/domain/usecases'

export interface LoadSurveysRepository {
  loadAll: () => Promise<LoadSurveysRepository.Result>
}
export namespace LoadSurveysRepository {
  export type Result = LoadSurveys.Result
}
