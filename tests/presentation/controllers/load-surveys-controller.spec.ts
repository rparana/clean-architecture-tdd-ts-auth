import faker from 'faker'
import { noContent, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { LoadSurveysController } from '@/presentation/controllers'
import { ServerError } from '@/presentation/errors'
import { LoadSurveysSpy } from '../mocks'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysSpy: LoadSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)
  return {
    sut,
    loadSurveysSpy
  }
}

const mockRequest = (): LoadSurveysController.Request => {
  return {
    accountId: faker.random.uuid()
  }
}
describe('LoadSurvey Controller', () => {
  test('Should call LoadSurveys with a correct values', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveysSpy.params).toBe(request.accountId)
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 204 if LoadSurvey returns null', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.result = []
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 200 if LoadSurvey returns success', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveysSpy.result))
  })
})
