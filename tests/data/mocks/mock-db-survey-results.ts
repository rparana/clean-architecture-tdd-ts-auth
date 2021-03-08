import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { SaveSurveyResultRepository } from '@/data/protocols'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  params: SaveSurveyResultParams
  result = mockSurveyResultModel()
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.params = data
    return Promise.resolve(this.result)
  }
}
