import { AccountModel } from '../../../../domain/models/account'

export interface LoadAccountByTokenRepository {
  load: (accessToken: string, role?: string) => Promise<AccountModel>
}
