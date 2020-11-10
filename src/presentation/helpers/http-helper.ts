import { HttpResponse } from '../controllers/protocols/http'
export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
