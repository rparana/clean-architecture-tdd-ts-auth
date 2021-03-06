import { SaveSurveyResultRepository } from '@/data/protocols'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
import { SurveyResultModel } from '@/domain/models'

export class DbSaveSurveyResults implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  async save (survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return await this.saveSurveyResultRepository.save(survey)
  }
}
