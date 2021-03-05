import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController, makeSignupController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
