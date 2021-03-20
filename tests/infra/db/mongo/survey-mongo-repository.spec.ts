import FakeObjectId from 'bson-objectid'
import { MongoHelper, SurveyMongoRepository } from '@/infra/db/mongodb'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { Collection } from 'mongodb'

const fakeObjectId = new FakeObjectId()

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.ops[0]._id
}

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  surveyCollection = await MongoHelper.getCollection('surveys')
  surveyResultCollection = await MongoHelper.getCollection('surveyResults')
  accountCollection = await MongoHelper.getCollection('accounts')
  await surveyCollection.deleteMany({})
  await surveyResultCollection.deleteMany({})
  await accountCollection.deleteMany({})
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
      const accountId = await mockAccountId()
      const addSurveyParams = [
        mockAddSurveyParams(),
        mockAddSurveyParams()
      ]
      const result = await surveyCollection.insertMany(addSurveyParams)
      const survey = result.ops[0]
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyParams[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyParams[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load surveys return empty list', async () => {
      const sut = makeSut()
      const accountId = await mockAccountId()
      const surveys = await sut.loadAll(accountId)
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

  describe('CheckSurveyById', () => {
    test('Should check survey success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.checkById(res.ops[0]._id)
      expect(survey).toBe(true)
    })

    test('Should check survey by id return false', async () => {
      const sut = makeSut()
      const survey = await sut.checkById(fakeObjectId.id)
      expect(survey).toBe(false)
    })
  })
})
