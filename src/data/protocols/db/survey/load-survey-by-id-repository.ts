import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyByIdRepository {
  loadById: (surveyId: string) => Promise<SurveyModel>
}
