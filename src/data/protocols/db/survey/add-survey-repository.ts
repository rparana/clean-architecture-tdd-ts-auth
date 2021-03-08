import { AddSurveyParams } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (data: AddSurveyParams) => Promise<void>
}
