export interface LoadAnswersBySurveyId {
  loadAnswers: (id: string) => Promise<LoadAnswersBySurveyId.Result>
}
export namespace LoadAnswersBySurveyId {
  export type Result = string[]
}
