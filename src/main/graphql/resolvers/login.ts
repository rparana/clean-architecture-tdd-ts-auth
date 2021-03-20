import { adaptResolver } from '@/main/adapters'
import { makeLoginController } from '@/main/factories/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export default {
  Query: {
    login: async (_parent: any, args: any) => adaptResolver(makeLogControllerDecorator(makeLoginController()), args)
  }
}
