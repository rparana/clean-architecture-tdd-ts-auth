import faker from 'faker'
import { AddAccount, Authentication, LoadAccountByToken } from '@/domain/usecases'

export class AddAccountSpy implements AddAccount {
  params: AddAccount.Params
  result = true
  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = params
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  params: Authentication.Params
  result = faker.random.uuid()
  async auth (params: Authentication.Params): Promise<Authentication.Result> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role: string
  result = { id: faker.random.uuid() }
  async load (token: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.accessToken = token
    this.role = role
    return Promise.resolve(this.result)
  }
}
