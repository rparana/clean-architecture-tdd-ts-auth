import faker from 'faker'
import { DbLoadSurveys } from '@/data/usecases'
import { throwError } from '@/tests/domain/mocks'
import { LoadSurveysRepositorySpy } from '../mocks'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)

  return {
    sut,
    loadSurveysRepositorySpy
  }
}

const accountId = faker.random.uuid()

describe('DbLoadSurvey', () => {
  test('Should call LoadSurveysRepository with a correct value', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    await sut.load(accountId)
    await expect(loadSurveysRepositorySpy.params).toBe(accountId)
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load(accountId)
    await expect(promise).rejects.toThrow()
  })

  test('Should return correct values if LoadSurveysRepository success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const promise = await sut.load(accountId)
    expect(promise).toEqual(loadSurveysRepositorySpy.results)
  })
})
