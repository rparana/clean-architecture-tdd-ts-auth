import { AddSurveyParams } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (survey: AddSurveyParams) => Promise<void>
}
