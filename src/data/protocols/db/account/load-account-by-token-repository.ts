import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByTokenRepository {
  loadByToken: (accessToken: string, role?: string) => Promise<AccountModel>
}
