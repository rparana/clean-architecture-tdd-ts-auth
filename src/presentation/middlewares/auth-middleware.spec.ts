import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'

describe('AuthMiddleware', () => {
  test('Should return 403 if no x-access-token exists in header', async () => {
    const sut = new AuthMiddleware()
    const auth = await sut.handle({})
    expect(auth).toEqual(forbidden(new AccessDeniedError()))
  })
})
