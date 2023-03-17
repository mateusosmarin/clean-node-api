/* eslint-disable @typescript-eslint/no-misused-promises */
import { adaptRoute } from '@main/adapters/express-route-adapter'
import { makeLoadSurveyResultController } from '@main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'
import { makeSaveSurveyResultController } from '@main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { auth } from '@main/factories/middlewares/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController())
  )
  router.get(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeLoadSurveyResultController())
  )
}
