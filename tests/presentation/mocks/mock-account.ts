import faker from 'faker'
import { AddAccount, Authentication, AuthenticationParams, LoadAccountByToken } from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'
import { AccountModel } from '@/domain/models'

export class AddAccountSpy implements AddAccount {
  params: AddAccount.Params
  result = true
  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = params
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  params: AuthenticationParams
  result = faker.random.uuid()
  async auth (params: AuthenticationParams): Promise<string> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role: string
  result = mockAccountModel()
  async load (token: string, role?: string): Promise<AccountModel> {
    this.accessToken = token
    this.role = role
    return Promise.resolve(this.result)
  }
}
