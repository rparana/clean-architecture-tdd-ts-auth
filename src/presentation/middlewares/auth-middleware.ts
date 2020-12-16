import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.headers) {
      await this.loadAccountByToken.load(httpRequest.headers['x-access-token'])
    }
    return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
  }
}
