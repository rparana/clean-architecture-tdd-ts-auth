import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveysController } from '@/main/factories/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export default {
  Query: {
    surveys: async (_parent: any, args: any, context: any) => adaptResolver(makeLogControllerDecorator(makeLoadSurveysController()), null, context)
  }
}
