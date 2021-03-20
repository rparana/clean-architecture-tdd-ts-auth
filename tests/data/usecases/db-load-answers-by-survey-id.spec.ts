import faker from 'faker'
import { DbLoadAnswersBySurveyId } from '@/data/usecases'
import { throwError } from '@/tests/domain/mocks'
import { LoadAnswersBySurveyIdRepositorySpy } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbLoadAnswersBySurveyId
  loadAnswersBySurveyIdRepositorySpy: LoadAnswersBySurveyIdRepositorySpy
}

let surveyId: string
const makeSut = (): SutTypes => {
  const loadAnswersBySurveyIdRepositorySpy = new LoadAnswersBySurveyIdRepositorySpy()
  const sut = new DbLoadAnswersBySurveyId(loadAnswersBySurveyIdRepositorySpy)

  return {
    sut,
    loadAnswersBySurveyIdRepositorySpy
  }
}

describe('DbLoadAnswersBySurvey', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid()
  })
  test('Should call LoadAnswersBySurveyIdRepository with correct value', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyIdRepositorySpy.id).toBe(surveyId)
  })

  test('Should DbLoadAnswersBySurvey return answers on success', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    const result = await sut.loadAnswers(surveyId)
    expect(result).toEqual([
      loadAnswersBySurveyIdRepositorySpy.result[0],
      loadAnswersBySurveyIdRepositorySpy.result[1],
      loadAnswersBySurveyIdRepositorySpy.result[2],
      loadAnswersBySurveyIdRepositorySpy.result[3]
    ])
  })

  test('Should DbLoadAnswersBySurvey throw if LoadAnswersBySurveyIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveyIdRepositorySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const promise = sut.loadAnswers(surveyId)
    await expect(promise).rejects.toThrow()
  })

  test('Should DbLoadAnswersBySurvey return correct values if LoadSurveyRepository success', async () => {
    const { sut, loadAnswersBySurveyIdRepositorySpy } = makeSut()
    loadAnswersBySurveyIdRepositorySpy.result = []
    const answers = await sut.loadAnswers(surveyId)
    expect(answers).toEqual([])
  })
})
