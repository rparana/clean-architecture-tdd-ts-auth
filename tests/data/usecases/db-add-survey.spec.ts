import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepositorySpy } from '@/tests/data/mocks'
import { mockAddSurveyParams, throwError } from '@/tests/domain/mocks'
import Mockdate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)

  return {
    sut,
    addSurveyRepositorySpy
  }
}

describe('DbAddSurvey', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  test('Should call AddSurveyRepository with a correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const surveyData = mockAddSurveyParams()
    await sut.add(surveyData)
    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should no return if AddSurveyRepository success', async () => {
    const { sut } = makeSut()
    const promise = await sut.add(mockAddSurveyParams())
    expect(promise).toBeFalsy()
  })
})
