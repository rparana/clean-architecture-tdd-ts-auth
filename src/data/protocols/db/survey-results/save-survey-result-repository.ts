import { SaveSurveyResult } from '@/domain/usecases'

export interface SaveSurveyResultRepository {
  save: (SaveSurveyResultParams: SaveSurveyResultRepository.Params) => Promise<SaveSurveyResultRepository.Result>
}
export namespace SaveSurveyResultRepository {
  export type Params = SaveSurveyResult.Params
  export type Result = SaveSurveyResult.Result
}
