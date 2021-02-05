import { SurveyModel } from '@/domain/models/survey'
import { noContent } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, LoadSurvey } from './load-survey-protocols'
import { LoadSurveyController } from './load-survey-controller'

const fakeHttpRequest: HttpRequest = {
  headers: null,
  body: null
}

const fakeSurvey = {
  id: '1',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
}

const makeLoadSurveyStub = (): LoadSurvey => {
  class LoadSurveyStub implements LoadSurvey {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve([
        fakeSurvey,
        {
          ...fakeSurvey,
          id: '2'
        }
      ]))
    }
  }
  return new LoadSurveyStub()
}
interface SutTypes {
  sut: LoadSurveyController
  loadSurveyStub: LoadSurvey
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
  test('Should return 204 if load returns null', async () => {
    const { sut, loadSurveyStub } = makeSut()
    jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 200 if load returns items', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })
})
