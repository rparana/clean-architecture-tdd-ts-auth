import { Controller, HttpResponse } from '@/presentation/protocols'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurvey: LoadSurveys) { }

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
  }
}
