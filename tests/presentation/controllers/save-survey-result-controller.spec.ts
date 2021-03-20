import MockDate from 'mockdate'
import faker from 'faker'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import { LoadAnswersBySurveyIdSpy, SaveSurveyResultSpy } from '../mocks'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (answer: string = null): SaveSurveyResultController.Request => ({
  surveyId: faker.random.uuid(),
  answer,
  accountId: faker.random.uuid()
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveyIdSpy: LoadAnswersBySurveyIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyIdSpy = new LoadAnswersBySurveyIdSpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(loadAnswersBySurveyIdSpy, saveSurveyResultSpy)
  return {
    sut,
    loadAnswersBySurveyIdSpy,
    saveSurveyResultSpy
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should calls LoadAnswersBySurveyId with correct values', async () => {
    const { sut, loadAnswersBySurveyIdSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadAnswersBySurveyIdSpy.params).toBe(request.surveyId)
  })

  test('Should return 403 if LoadAnswersBySurveyId returns null', async () => {
    const { sut, loadAnswersBySurveyIdSpy } = makeSut()
    loadAnswersBySurveyIdSpy.result = []
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadAnswersBySurveyId throws', async () => {
    const { sut, loadAnswersBySurveyIdSpy } = makeSut()
    jest.spyOn(loadAnswersBySurveyIdSpy, 'loadAnswers').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 403 an invalid answer provider', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should calls SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveyIdSpy } = makeSut()
    const request = mockRequest(loadAnswersBySurveyIdSpy.result[0])
    await sut.handle(request)
    expect(saveSurveyResultSpy.params).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      answer: request.answer,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveyIdSpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveyIdSpy.result[0]))
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveyIdSpy } = makeSut()
    const request = mockRequest(loadAnswersBySurveyIdSpy.result[0])
    const response = await sut.handle(request)
    expect(response).toEqual(ok(saveSurveyResultSpy.result))
  })
})
