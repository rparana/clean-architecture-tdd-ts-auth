import { LoadAnswersBySurveyId, SaveSurveyResult } from '@/domain/usecases'
import { Controller } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadAnswersBySurveyId: LoadAnswersBySurveyId,
    private readonly SaveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: SaveSurveyResultController.Request): Promise<any> {
    try {
      const { surveyId, answer, accountId } = request
      const answers = await this.loadAnswersBySurveyId.loadAnswers(surveyId)
      if (answers.length > 0) {
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.SaveSurveyResult.save({
        surveyId,
        answer,
        accountId,
        date: new Date()
      })
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}
