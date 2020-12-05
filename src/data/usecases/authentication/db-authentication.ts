import { HashComparer } from 'data/protocols/criptography/hash-comparer'
import { TokenGenerator } from 'data/protocols/criptography/token-generator'
import { UpdateAccessTokenRepository } from 'data/protocols/db/update-access-token-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const userAccount = await this.loadAccountByEmailRepository.load(authentication.email)
    if (userAccount) {
      const isValid = await this.hashComparer.compare(authentication.password, userAccount.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(userAccount.id)
        await this.updateAccessTokenRepository.update(userAccount.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
