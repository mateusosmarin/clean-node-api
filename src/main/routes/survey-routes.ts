/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '@main/adapters/express-route-adapter'
import { makeAddSurveyController } from '@main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '@main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { adminAuth } from '@main/factories/middlewares/admin-auth'
import { auth } from '@main/factories/middlewares/auth'

export default async (router: Router): Promise<void> => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
