import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers'
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/db-add-survey-factory'

export const makeSurveyController = (): Controller => {
  const surveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(surveyController)
}
