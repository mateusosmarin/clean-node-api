import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '../../usecases/authentication/db-add-account-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
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
