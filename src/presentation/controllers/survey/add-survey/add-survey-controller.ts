import { Controller, HttpRequest, Validation } from './add-survey-protocols'
import { badRequest } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) { }

  async handle (httpRequest: HttpRequest): Promise<any> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    return null
  }
}
