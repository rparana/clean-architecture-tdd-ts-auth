import { AccountModel } from '@/presentation/middlewares/auth-middleware-protocols'
import faker from 'faker'
import { AddAccountParams, AuthenticationParams } from '../usecases'

export const mockAddAccountParams = (): AddAccountParams => (
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  })

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
