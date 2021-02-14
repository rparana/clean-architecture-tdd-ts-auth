import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyRepository {
  load: () => Promise<SurveyModel[]>
}
