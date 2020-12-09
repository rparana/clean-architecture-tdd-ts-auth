import { makeLoginValidation } from './login-validation-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { Controller } from '../../../../presentation/protocols'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
