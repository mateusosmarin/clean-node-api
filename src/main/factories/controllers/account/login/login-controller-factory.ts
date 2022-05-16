import { LoginController } from '@presentation/controllers/login/login/login-controller'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '@main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@main/factories/usecases/account/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeDbAuthentication()
  const controller = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  )
  return makeLogControllerDecorator(controller)
}
