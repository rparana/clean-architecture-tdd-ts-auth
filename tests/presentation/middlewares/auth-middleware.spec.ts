import faker from 'faker'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware-protocols'
import { ServerError, AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadAccountByTokenSpy } from '../mocks'
import { throwError } from '@/tests/domain/mocks'

const makeFakeRequest = (): AuthMiddleware.Request => ({
  accessToken: faker.random.uuid()
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)

  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe('AuthMiddleware', () => {
  test('Should return 403 if no x-access-token exists in header', async () => {
    const { sut } = makeSut()
    const auth = await sut.handle({})
    expect(auth).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should calls LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(loadAccountByTokenSpy.accessToken).toBe(request.accessToken)
    expect(loadAccountByTokenSpy.role).toBe(role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.result = null
    const auth = await sut.handle(makeFakeRequest())
    expect(auth).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    const auth = await sut.handle(makeFakeRequest())
    expect(auth).toEqual(ok({ accountId: loadAccountByTokenSpy.result.id }))
  })
})
