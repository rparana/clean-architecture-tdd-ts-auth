export interface AddSurveyModel {
  question: string
  answers:
  Array<{
    image?: string
    answer: string
  }>
}

export interface AddSurvey {
  add: (survey: AddSurveyModel) => Promise<void>
}
