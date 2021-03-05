import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSurveyController, makeLoadSurveysController } from '../factories/controllers'
import { adminAuth, auth } from '../middleware'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
