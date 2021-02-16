import { SurveyModel } from '@/domain/models/survey'
import { noContent, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, LoadSurveys } from './load-surveys-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import { ServerError } from '@/presentation/errors'
import MockDate from 'mockdate'

const fakeHttpRequest: HttpRequest = {
  headers: null,
  body: null
}

const makefakeSurvey = (): SurveyModel[] => {
  return [{
    id: '1',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  },
  {
    id: '2',
    question: 'another_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }]
}

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makefakeSurvey()))
    }
  }
  return new LoadSurveysStub()
}
interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle(fakeHttpRequest)
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 204 if LoadSurvey returns null', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 200 if LoadSurvey returns success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(ok(makefakeSurvey()))
  })
})
