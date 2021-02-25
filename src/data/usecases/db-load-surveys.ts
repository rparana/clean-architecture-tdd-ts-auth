import { LoadSurveysRepository } from '@/data/protocols'
import { LoadSurveys } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveyRepository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[]> {
    return this.loadSurveyRepository.loadAll()
  }
}
