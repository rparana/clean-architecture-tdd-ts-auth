import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-results/survey-results-repository'
import { AccountModel, SurveyModel } from '@/domain/models'

let surveyCollection: Collection
let surveyResultsCollection: Collection
let accountCollection: Collection

const makeSurveyModel = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer'
    }],
    date: new Date()
  })
  return res.ops[0]
}

const makeAccountModel = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  return res.ops[0]
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

describe('Survey Results Mongo Repository', () => {
  describe('save Survey Result', () => {
    test('Should insert a survey result if its new', async () => {
      const sut = makeSut()
      const survey = await makeSurveyModel()
      const account = await makeAccountModel()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: `${survey.answers[0].answer}`,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toEqual(survey.answers[0].answer)
    })

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurveyModel()
      const account = await makeAccountModel()
      const res = await surveyResultsCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
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
      expect(surveyResult.id).toEqual(res.ops[0]._id)
      expect(surveyResult.answer).toEqual(survey.answers[1].answer)
    })
  })
})
