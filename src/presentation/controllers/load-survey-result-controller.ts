import { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { Controller } from '@/presentation/protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (request: LoadSurveyResultController.Request): Promise<any> {
    try {
      const { surveyId, accountId } = request
      const survey = await this.checkSurveyById.checkById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}
