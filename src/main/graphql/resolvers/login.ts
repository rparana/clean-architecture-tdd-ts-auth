import { adaptResolver } from '@/main/adapters'
import { makeLoginController, makeSignupController } from '@/main/factories/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export default {
  Query: {
    login: async (_parent: any, args: any) => adaptResolver(makeLogControllerDecorator(makeLoginController()), args)
  },

  Mutation: {
    signUp: async (_parent: any, args: any) => adaptResolver(makeLogControllerDecorator(makeSignupController()), args)
  }
}
