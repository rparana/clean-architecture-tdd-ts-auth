import FakeObjectId from 'bson-objectid'
import { MongoHelper, SurveyMongoRepository } from '@/infra/db/mongodb'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { Collection } from 'mongodb'

const fakeObjectId = new FakeObjectId()

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  surveyCollection = await MongoHelper.getCollection('surveys')
  await surveyCollection.deleteMany({})
})

describe('SurveyMongoRepository', () => {
  describe('add Survey', () => {
    test('Should add a survey success', async () => {
      const sut = makeSut()
      const addSurveyParams = mockAddSurveyParams()
      await sut.add(addSurveyParams)
      const survey = await surveyCollection.findOne({ question: addSurveyParams.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('load Surveys', () => {
    test('Should load surveys success', async () => {
      const addSurveyParams = [
        mockAddSurveyParams(),
        mockAddSurveyParams()
      ]
      await surveyCollection.insertMany(addSurveyParams)
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyParams[0].question)
      expect(surveys[1].question).toBe(addSurveyParams[1].question)
    })

    test('Should load surveys return empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('load Survey By Id', () => {
    test('Should load survey success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(res.ops[0]._id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('Should load survey by id return null', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(fakeObjectId.id)
      expect(survey).toBeFalsy()
    })
  })
})
