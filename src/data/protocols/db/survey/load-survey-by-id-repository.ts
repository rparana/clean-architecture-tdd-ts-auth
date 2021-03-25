export interface LoadSurveyByIdRepository {
  loadById: (surveyId: string) => Promise<LoadSurveyByIdRepository.Result>
}
export namespace LoadSurveyByIdRepository {
  export type Result = {
    id: string
    question: string
    answers:
    Array<{
      image?: string
      answer: string
    }>
    date: Date
  }
}
