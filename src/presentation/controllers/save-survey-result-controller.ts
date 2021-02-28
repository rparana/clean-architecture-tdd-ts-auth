import { Controller, HttpRequest, Validation } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly validation: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<any> {
    this.validation.validate(httpRequest.body)
    return null
  }
}
