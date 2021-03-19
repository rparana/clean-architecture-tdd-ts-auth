import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers'
import { auth } from '../middleware'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
}
