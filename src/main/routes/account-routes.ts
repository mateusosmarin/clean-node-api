/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '@main/adapters/express-route-adapter'
import { makeLoginController } from '@main/factories/controllers/account/login/login-controller-factory'
import { makeSignUpController } from '@main/factories/controllers/account/signup/signup-controller-factory'

export default async (router: Router): Promise<void> => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
