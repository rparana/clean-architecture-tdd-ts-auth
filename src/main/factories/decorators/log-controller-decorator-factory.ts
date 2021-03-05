import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { Controller } from '@/presentation/protocols'
import { LogMongoRepository } from '@/infra/db/mongodb'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
