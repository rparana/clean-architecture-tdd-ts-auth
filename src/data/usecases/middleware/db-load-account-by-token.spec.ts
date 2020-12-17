import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (_: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(loadAccountByTokenRepositoryStub)
  return {
    sut,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call LoadAccountByTokenRepository with correct token', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token')
    expect(loadByTokenSpy).toBeCalledWith('any_token')
  })
})
