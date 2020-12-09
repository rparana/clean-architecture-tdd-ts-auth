import { SignUpController } from './signup-controller'
import { MissingParamError, ServerError } from '../../errors'
import { AccountModel, AddAccount, AddAccountModel, Validation, Authentication, AuthenticationModel } from './signup-controller-protocols'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
    passwordConfirmation: 'hashed_password'
  }
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (_: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise((resolve, reject) => resolve('valid_token'))
    }
  }
  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (_: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationtStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationtStub = makeValidation()
  const authenticationStub = makeAuthenticationStub()
  const sut = new SignUpController(addAccountStub, validationtStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationtStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'valid_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationtStub } = makeSut()
    const addSpy = jest.spyOn(validationtStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationtStub } = makeSut()
    jest.spyOn(validationtStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Shoud call Authentication with a correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const isValidSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith({ email: 'valid_email@mail.com', password: 'hashed_password' })
  })

  test('Shoud returns 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
