import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    surveys: [Survey!]! @auth
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswers!]!
    date: DateTime!
    didAnswer: Boolean
  }

  type SurveyAnswers {
    image: String
    answer: String!
  }
`
