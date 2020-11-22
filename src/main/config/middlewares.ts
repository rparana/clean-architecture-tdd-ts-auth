import { Express } from 'express'
import { bodyParser } from '../middleware/body-parser'
import { cors } from '../middleware/cors'
import { contentType } from '../middleware/content-type'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
