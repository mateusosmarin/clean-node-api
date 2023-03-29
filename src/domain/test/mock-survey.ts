import { SurveyModel } from '@domain/models/survey'
import { AddSurveyParams } from '@domain/usecases/survey/add-survey'
import { faker } from '@faker-js/faker'

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: faker.datatype.uuid(),
    question: faker.random.words(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.random.words()
      },
      {
        image: faker.image.imageUrl(),
        answer: faker.random.words()
      }
    ],
    date: faker.date.recent()
  }
}

export const mockSurveysModel = (): SurveyModel[] => {
  return [
    {
      id: faker.datatype.uuid(),
      question: faker.random.words(),
      answers: [
        {
          image: faker.image.imageUrl(),
          answer: faker.random.words()
        }
      ],
      date: faker.date.recent()
    },
    {
      id: faker.datatype.uuid(),
      question: faker.random.words(),
      answers: [
        {
          image: faker.image.imageUrl(),
          answer: faker.random.words()
        }
      ],
      date: faker.date.recent()
    }
  ]
}

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.words()
    }
  ],
  date: faker.date.recent()
})
