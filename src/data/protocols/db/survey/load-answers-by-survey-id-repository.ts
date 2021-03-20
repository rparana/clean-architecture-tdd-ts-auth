import { LoadAnswersBySurveyId } from '@/domain/usecases'

export interface LoadAnswersBySurveyIdRepository {
  loadAnswers: (surveyId: string) => Promise<LoadAnswersBySurveyIdRepository.Result>
}
export namespace LoadAnswersBySurveyIdRepository {
  export type Result = LoadAnswersBySurveyId.Result
}
