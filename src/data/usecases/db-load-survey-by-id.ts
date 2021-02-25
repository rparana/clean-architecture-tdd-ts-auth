import { LoadSurveyByIdRepository } from '@/data/protocols'
import { LoadSurveyById } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById (surveyId: string): Promise<SurveyModel> {
    return this.loadSurveyByIdRepository.loadById(surveyId)
  }
}
