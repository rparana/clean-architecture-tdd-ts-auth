import { LoadSurvey } from '@/domain/usecases/load-survey'
import { noContent, ok } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from './load-survey-protocols'

export class LoadSurveyController implements Controller {
  constructor (private readonly loadSurvey: LoadSurvey) { }

  async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurvey.load()
    if (!surveys) {
      return noContent()
    }
    return ok(surveys)
  }
}
