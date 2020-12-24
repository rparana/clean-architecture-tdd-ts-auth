import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

interface MakeAccessTokenDataType {
  name: string
  email: string
  password: string
  role?: string
}

const makeAccessToken = async (makeAccessTokenData: MakeAccessTokenDataType): Promise<string> => {
  const result = await accountCollection.insertOne(makeAccessTokenData)
  const id = result.ops[0]._id
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

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('POST /survey', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/survey')
        .send({
          question: 'Question',
          answers: [{
            image: 'https://image.name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 403 on add survey with accessToken is no admin', async () => {
      const accessToken = await makeAccessToken({
        name: 'Rafael Paraná',
        email: 'paranafael@yahoo.com.br',
        password: '123456'
      })
      await request(app)
        .post('/api/survey')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            image: 'https://image.name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })
  })
})
