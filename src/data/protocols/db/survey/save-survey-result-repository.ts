import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultModel } from '@/domain/usecases'

export interface SaveSurveyResultRepository {
  save: (SaveSurveyResultModel: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
