import { LoadSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById, makeDbLoadSurveyResuts } from '@/main/factories/usecases'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResuts())
  return makeLogControllerDecorator(controller)
}
