import { SaveSurveyResultRepository } from '@/data/protocols'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecases'
import { SurveyResultModel } from '@/domain/models'

export class DbSaveSurveyResults implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  async save (survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return await this.saveSurveyResultRepository.save(survey)
  }
}
