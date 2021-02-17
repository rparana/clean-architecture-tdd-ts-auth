export type AddSurveyModel = {
  question: string
  answers:
  Array<{
    image?: string
    answer: string
  }>
  date: Date
}

export interface AddSurvey {
  add: (survey: AddSurveyModel) => Promise<void>
}
