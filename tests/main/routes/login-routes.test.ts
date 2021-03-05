import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Rafael',
          email: 'paranafael@yahoo.com.br',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
    })
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Rafael',
          email: 'paranafael@yahoo',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(400)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123456', 12)
      await accountCollection.insertOne({
        name: 'Rafael',
        email: 'paranafael@yahoo.com.br',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'paranafael@yahoo.com.br',
          password: '123456'
        })
        .expect(200)
    })

    test('Should return 401 with invalid credentials', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'paranafael@yahoo.com.br',
          password: '123456'
        })
        .expect(401)
    })
  })
})
