import { Controller, HttpRequest, Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) { }

  async handle (httpRequest: HttpRequest): Promise<any> {
    this.validation.validate(httpRequest.body)
    return null
  }
}
