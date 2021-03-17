export type SurveyModel = {
  id: string
  question: string
  answers: Answers[]
  date: Date
}

type Answers ={
  image?: string
  answer: string
}
