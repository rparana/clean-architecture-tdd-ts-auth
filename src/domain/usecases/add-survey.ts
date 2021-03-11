export interface AddSurvey {
  add: (survey: AddSurvey.Params) => Promise<void>
}
export namespace AddSurvey {
  export type Params = {
    question: string
    answers: answer[]
    date: Date
    didAnswer?: boolean
  }
  type answer = {
    image?: string
    answer: string
  }
}
