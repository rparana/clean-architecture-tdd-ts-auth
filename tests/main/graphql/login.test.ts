import faker from 'faker'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { MongoHelper } from '@/infra/db/mongodb'
import { makeApolloServer } from './helpers'

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const loginQuery = gql`
      query login ($email: String!, $password: String!) {
        login (email: $email, password: $password) {
          accessToken
          name
        }
      }
    `
    test('Should return an Account on valid credentials', async () => {
      const password = faker.internet.password()
      const hashedPassword = await hash(password, 12)
      const name = faker.name.findName()
      const email = faker.internet.email()
      await accountCollection.insertOne({
        name,
        email,
        password: hashedPassword
      })
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email,
          password
        }
      })
      expect(res.data.login.accessToken).toBeTruthy()
      expect(res.data.login.name).toBe(name)
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: faker.internet.email(),
          password: faker.internet.password()
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const signUpMutation = gql`
      mutation signUp ($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        signUp (name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
          accessToken
          name
        }
      }
    `
    test('Should return an Account on sucess', async () => {
      const password = faker.internet.password()
      const name = faker.name.findName()
      const email = faker.internet.email()
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation, {
        variables: {
          name,
          email,
          password,
          passwordConfirmation: password
        }
      })
      expect(res.data.signUp.accessToken).toBeTruthy()
      expect(res.data.signUp.name).toBe(name)
    })

    test('Should return an EmailInUseError on credentials already exists', async () => {
      const password = faker.internet.password()
      const hashedPassword = await hash(password, 12)
      const name = faker.name.findName()
      const email = faker.internet.email()
      await accountCollection.insertOne({
        name,
        email,
        password: hashedPassword
      })
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation, {
        variables: {
          name,
          email,
          password,
          passwordConfirmation: password
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('The received email is already in use')
    })
  })
})
