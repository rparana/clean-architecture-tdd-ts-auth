import { CheckSurveyById } from '@/domain/usecases'

export interface CheckSurveyByIdRepository {
  checkById: (surveyId: string) => Promise<CheckSurveyByIdRepository.Result>
}
export namespace CheckSurveyByIdRepository {
  export type Result = CheckSurveyById.Result
}
