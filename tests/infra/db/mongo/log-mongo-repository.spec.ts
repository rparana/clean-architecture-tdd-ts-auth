import faker from 'faker'
import { Collection } from 'mongodb'
import { MongoHelper, LogMongoRepository } from '@/infra/db/mongodb'
describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  const makeSut = (): LogMongoRepository => new LogMongoRepository()

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError(faker.random.words())
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
