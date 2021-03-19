import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db/mongodb'
import { Collection, ObjectId } from 'mongodb'
import { SurveyModel } from '@/domain/models'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return MongoHelper.map(res.ops[0])
}

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.ops[0]._id
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
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

describe('SurveyResultsMongoRepository', () => {
  describe('save Survey Result', () => {
    test('Should insert a survey result if its new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      await sut.save({
        surveyId: survey.id,
        accountId: accountId,
        answer: `${survey.answers[0].answer}`,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: accountId
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: `${survey.answers[0].answer}`,
        date: new Date()
      })
      await sut.save({
        surveyId: survey.id,
        accountId: accountId,
        answer: `${survey.answers[1].answer}`,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection
        .find({
          surveyId: survey.id,
          accountId: accountId
        })
        .toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('LoadBySurveyId', () => {
    test('Should load a survey result if exists', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const accountId = await mockAccountId()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: `${survey.answers[0].answer}`,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: `${survey.answers[0].answer}`,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: `${survey.answers[1].answer}`,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: `${survey.answers[1].answer}`,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
    })
  })
})
