import { AddAccount, AddAccountParams } from '@/domain/usecases'
import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (data: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(data.email)
    if (!account) {
      const { password, ...dataWithoutPassword } = data
      const hashedPassword = await this.hasher.hash(password)
      const newAccount = await this.addAccountRepository.add(Object.assign({}, dataWithoutPassword, { password: hashedPassword }))
      return newAccount
    }
    return null
  }
}
