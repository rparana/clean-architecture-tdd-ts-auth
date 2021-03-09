import { AddAccountParams } from '@/domain/usecases/add-account'

export interface AddAccountRepository {
  add: (accountData: AddAccountParams) => Promise<boolean>
}
