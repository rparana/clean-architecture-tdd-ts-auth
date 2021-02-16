import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { adminAuth, auth } from '../middleware'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
