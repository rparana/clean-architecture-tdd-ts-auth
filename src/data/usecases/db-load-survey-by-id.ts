import { LoadSurveyByIdRepository } from '@/data/protocols'
import { LoadSurveyById } from '@/domain/usecases'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById (surveyId: string): Promise<LoadSurveyById.Result> {
    return this.loadSurveyByIdRepository.loadById(surveyId)
  }
}
