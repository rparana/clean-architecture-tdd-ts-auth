import { SurveyModel } from '../models/survey'

export interface LoadSurvey {
  load: () => Promise<SurveyModel[]>
}
