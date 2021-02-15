import { SurveyModel } from '@/domain/models/survey'
import { noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, LoadSurveys } from './load-surveys-protocols'
import { LoadSurveyController } from './load-surveys-controller'
import { ServerError } from '@/presentation/errors'
import MockDate from 'mockdate'

const fakeHttpRequest: HttpRequest = {
  headers: null,
  body: null
}

const makefakeSurvey = (): SurveyModel => {
  return {
    id: '1',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}

const makeLoadSurveyStub = (): LoadSurveys => {
  class LoadSurveyStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve([
        makefakeSurvey(),
        {
          ...makefakeSurvey(),
          id: '2'
        }
      ]))
    }
  }
  return new LoadSurveyStub()
}
interface SutTypes {
  sut: LoadSurveyController
  loadSurveyStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveyStub = makeLoadSurveyStub()
  const sut = new LoadSurveyController(loadSurveyStub)
  return {
    sut,
    loadSurveyStub
  }
}

describe('LoadSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should return 500 if LoadSurvey throws', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 204 if LoadSurvey returns null', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 200 if LoadSurvey returns success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })
})
