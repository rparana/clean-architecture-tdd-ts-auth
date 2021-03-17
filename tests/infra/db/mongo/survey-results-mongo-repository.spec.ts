import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db/mongodb'
import { Collection, ObjectId } from 'mongodb'
import { AccountModel, SurveyModel } from '@/domain/models'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'

let surveyCollection: Collection
let surveyResultsCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return MongoHelper.map(res.ops[0])
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.map(res.ops[0])
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
  surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
  accountCollection = await MongoHelper.getCollection('accounts')
  await surveyCollection.deleteMany({})
  await surveyResultsCollection.deleteMany({})
  await accountCollection.deleteMany({})
})

describe('SurveyResultsMongoRepository', () => {
  describe('save Survey Result', () => {
    test('Should insert a survey result if its new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: `${survey.answers[0].answer}`,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultsCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: `${survey.answers[0].answer}`,
        date: new Date()
      })
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: `${survey.answers[1].answer}`,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].answer).toBe(survey.answers[1].answer)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })
  })
})
