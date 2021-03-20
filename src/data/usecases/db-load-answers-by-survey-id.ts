import { LoadAnswersBySurveyIdRepository } from '@/data/protocols'
import { LoadAnswersBySurveyId } from '@/domain/usecases'

export class DbLoadAnswersBySurveyId implements LoadAnswersBySurveyId {
  constructor (private readonly loadAnswersBySurveyIdRepository: LoadAnswersBySurveyIdRepository) {}
  async loadAnswers (surveyId: string): Promise<LoadAnswersBySurveyId.Result> {
    return this.loadAnswersBySurveyIdRepository.loadAnswers(surveyId)
  }
}
