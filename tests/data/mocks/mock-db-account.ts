import faker from 'faker'
import { AddAccount } from '@/domain/usecases'
import { AddAccountRepository, CheckAccountByEmailRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '../protocols'

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
  result = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password()
  }

  async loadByEmail (params: string): Promise<LoadAccountByEmailRepository.Result> {
    this.params = params
    return Promise.resolve(this.result)
  }
}

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
  params: string
  result = false

  async checkByEmail (params: string): Promise<CheckAccountByEmailRepository.Result> {
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
  result = { id: faker.random.uuid() }
  token: string
  role: string

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token
    this.role = role
    return Promise.resolve(this.result)
  }
}
