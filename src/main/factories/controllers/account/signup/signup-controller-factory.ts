import { SignUpController } from '@presentation/controllers/login/signup/signup-controller'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '@main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '@main/factories/usecases/account/db-add-account-factory'
import { makeDbAuthentication } from '@main/factories/usecases/account/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const dbAddAccount = makeDbAddAccount()
  const validationComposite = makeSignUpValidation()
  const dbAuthentication = makeDbAuthentication()
  const controller = new SignUpController(
    dbAddAccount,
    validationComposite,
    dbAuthentication
  )
  return makeLogControllerDecorator(controller)
}
