export type SurveyModel = {
  id: string
  question: string
  answers: Answers[]
  date: Date
  didAnswer?: boolean
}

type Answers ={
  image?: string
  answer: string
}
