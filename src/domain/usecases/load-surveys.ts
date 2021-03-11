import { SurveyModel } from '../models/survey'

export interface LoadSurveys {
  load: () => Promise<LoadSurveys.Result>
}
export namespace LoadSurveys {
  export type Result = SurveyModel[]
}
