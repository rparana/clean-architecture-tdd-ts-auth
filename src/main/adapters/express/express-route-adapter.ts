import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
