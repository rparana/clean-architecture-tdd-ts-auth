import { AddAccount } from '@/domain/usecases'
import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '../protocols'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccount.Params
  result = true

  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = params
    return Promise.resolve(this.result)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  params: string
  result = mockAccountModel()

  async loadByEmail (params: string): Promise<AccountModel> {
    this.params = params
    return Promise.resolve(this.result)
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
    return Promise.resolve()
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  result = mockAccountModel()
  token: string
  role: string

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    this.token = token
    this.role = role
    return Promise.resolve(this.result)
  }
}
