import { SaveSurveyResultRepository } from '@/data/protocols'
import { SaveSurveyResult } from '@/domain/usecases'

export class DbSaveSurveyResults implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  async save (survey: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    return await this.saveSurveyResultRepository.save(survey)
  }
}
