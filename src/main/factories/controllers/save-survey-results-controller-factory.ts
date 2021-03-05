import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { makeDbLoadSurveyById, makeDbSaveSurveyResuts } from '@/main/factories/usecases'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResultController = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResuts())
  return makeLogControllerDecorator(saveSurveyResultController)
}
