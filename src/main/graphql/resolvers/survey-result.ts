import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export default {
  Query: {
    surveyResult: async (_parent: any, args: any, context: any) => adaptResolver(makeLogControllerDecorator(makeLoadSurveyResultController()), args, context)
  },

  Mutation: {
    saveSurveyResult: async (_parent: any, args: any, context: any) => adaptResolver(makeLogControllerDecorator(makeSaveSurveyResultController()), args, context)
  }
}
