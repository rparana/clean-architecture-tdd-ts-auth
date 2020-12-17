import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../login/add-account/db-add-account-protocols'
import { LoadAccountByToken } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository) {}

  async load (token: string): Promise<AccountModel> {
    const account = await this.loadAccountByTokenRepository.loadByToken(token)
    return account
  }
}
