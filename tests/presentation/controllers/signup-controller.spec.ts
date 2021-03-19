import faker from 'faker'
import { SignUpController } from '@/presentation/controllers'
import { MissingParamError, ServerError, EmailInUseError } from '@/presentation/errors'
import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/tests/domain/mocks'
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from '../mocks'

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationtSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationtSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(addAccountSpy, validationtSpy, authenticationSpy)
  return {
    sut,
    addAccountSpy,
    validationtSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addAccountSpy.params).toEqual({
      name: request.name,
      email: request.email,
      password: request.password
    })
  })

  test('Should return 403 if AddAccount return null', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.result))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationtSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationtSpy.input).toEqual(httpRequest)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationtSpy } = makeSut()
    validationtSpy.error = new MissingParamError('any_field')
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Shoud call Authentication with a correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(authenticationSpy.params).toEqual({ email: httpRequest.email, password: httpRequest.password })
  })

  test('Shoud returns 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
