import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { makeDbLoadAnswersBySurveyId, makeDbSaveSurveyResuts } from '@/main/factories/usecases'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(makeDbLoadAnswersBySurveyId(), makeDbSaveSurveyResuts())
  return makeLogControllerDecorator(saveSurveyResultController)
}
