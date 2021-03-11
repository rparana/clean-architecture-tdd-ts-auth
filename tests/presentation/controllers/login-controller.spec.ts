import faker from 'faker'
import { LoginController } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/tests/domain/mocks'
import { AuthenticationSpy, ValidationSpy } from '../mocks'

const mockRequest = (): LoginController.Request => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy
  }
}
describe('Login Controller', () => {
  test('Shoud call Authentication with a correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.params.email).toBe(request.email)
    expect(authenticationSpy.params.password).toBe(request.password)
  })

  test('Shoud return 401 if an invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.result = null
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Shoud returns 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Shoud return 200 if an valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok({ accessToken: authenticationSpy.result }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
