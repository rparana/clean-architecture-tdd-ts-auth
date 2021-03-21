import faker from 'faker'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'

import { MongoHelper } from '@/infra/db/mongodb'
import { makeApolloServer } from './helpers'
import env from '@/main/config/env'

let apolloServer: ApolloServer
let surveyCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: 'admin'
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Survey Query', () => {
    const surveyQuery = gql`
      query surveys {
        surveys {
          id
          question
          answers {
            answer
            image
          }
          didAnswer
          date
        }
      }
    `
    test('Should return an Survey on valid accessToken provider', async () => {
      const accessToken = await mockAccessToken()
      const now = new Date()
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'any_answer'
        }],
        date: now
      },
      {
        question: 'other_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'any_answer'
        }],
        date: now
      }
      ])
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveyQuery, {})
      expect(res.data.surveys).toBeTruthy()
      expect(res.data.surveys.length).toBe(2)
      expect(res.data.surveys[0].question).toBe('any_question')
      expect(res.data.surveys[0].date).toBe(now.toISOString())
      expect(res.data.surveys[0].didAnswer).toBe(false)
    })

    test('Should return an AccessDeniedError if no valid accessToken provider', async () => {
      const now = new Date()
      await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'any_answer'
        }],
        date: now
      })
      const { query } = createTestClient({
        apolloServer
      })
      const res: any = await query(surveyQuery, {})
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })
})
