import { SurveyModel } from '../models/survey'

export interface LoadSurveyById {
  loadById: (id: string) => Promise<LoadSurveyById.Result>
}
export namespace LoadSurveyById {
  export type Result = SurveyModel
}
