import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Rafael Paraná',
    email: 'paranafael@yahoo.com.br',
    password: '123',
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
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveiId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'Answer 1'
        })
        .expect(403)
    })

    test('Should return 200 on save survey with valid accessToken', async () => {
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          image: 'https://image.name.com',
          answer: 'Answer 1'
        },
        {
          answer: 'Answer 2'
        }]
      })
      const surveyId: string = res.ops[0]._id
      const accessToken = await mockAccessToken()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })
})
