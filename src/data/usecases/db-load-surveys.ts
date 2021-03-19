import { LoadSurveysRepository } from '@/data/protocols'
import { LoadSurveys } from '@/domain/usecases'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveyRepository: LoadSurveysRepository) {}
  async load (accountId: string): Promise<LoadSurveys.Result> {
    return this.loadSurveyRepository.loadAll(accountId)
  }
}
