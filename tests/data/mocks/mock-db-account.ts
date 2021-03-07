import { AddAccountParams } from '@/domain/usecases'
import { AddAccountRepository, LoadAccountByEmailRepository } from '../protocols'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountParams
  result = mockAccountModel()

  async add (params: AddAccountParams): Promise<AccountModel> {
    this.params = params
    return this.result
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  params: string
  result = mockAccountModel()

  async loadByEmail (params: string): Promise<AccountModel> {
    this.params = params
    return this.result
  }
}
