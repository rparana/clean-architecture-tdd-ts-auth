import { LoadSurveyRepository, LoadSurvey, SurveyModel } from './db-load-survey-protocols'

export class DbLoadSurvey implements LoadSurvey {
  constructor (private readonly loadSurveyRepository: LoadSurveyRepository) {}
  async load (): Promise<SurveyModel[]> {
    return this.loadSurveyRepository.load()
  }
}
