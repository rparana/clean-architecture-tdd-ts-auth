import { makeSignupValidation } from './signup-validation-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { makeDbAuthentication, makeDbAddAccount } from '@/main/factories/usecases'
import { SignUpController } from '@/presentation/controllers'

export const makeSignupController = (): Controller => {
  const signupController = new SignUpController(makeDbAddAccount(), makeSignupValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signupController)
}
