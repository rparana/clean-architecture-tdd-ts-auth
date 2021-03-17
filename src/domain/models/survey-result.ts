export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: SurveyResultAnswers[]
  date: Date
}

type SurveyResultAnswers ={
  image?: string
  answer: string
  count: number
  percent: number
}
