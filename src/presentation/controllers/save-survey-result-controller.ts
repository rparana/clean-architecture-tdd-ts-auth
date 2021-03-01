import { LoadSurveyById } from '@/domain/usecases'
import { Controller, HttpRequest } from '@/presentation/protocols'
import { InvalidParamError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<any> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    return null
  }
}
