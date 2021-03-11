import { AccountModel } from '@/presentation/middlewares/auth-middleware-protocols'
import faker from 'faker'
import { AddAccount, Authentication } from '../usecases'

export const mockAddAccountParams = (): AddAccount.Params => (
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  })

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
