import { SurveyResultModel } from '@domain/models/survey-result'
import { SaveSurveyResultParams } from '@domain/usecases/survey-result/save-survey-result'
import { faker } from '@faker-js/faker'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid(),
  answer: faker.random.words(),
  date: faker.date.recent()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.words(),
      count: faker.datatype.number({ min: 0, max: 100 }),
      percent: faker.datatype.number({ min: 0, max: 100 })
    },
    {
      image: faker.image.imageUrl(),
      answer: faker.random.words(),
      count: faker.datatype.number({ min: 0, max: 100 }),
      percent: faker.datatype.number({ min: 0, max: 100 })
    }
  ],
  date: faker.date.recent()
})

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.words(),
      count: faker.datatype.number({ min: 0, max: 100 }),
      percent: faker.datatype.number({ min: 0, max: 100 })
    },
    {
      image: faker.image.imageUrl(),
      answer: faker.random.words(),
      count: faker.datatype.number({ min: 0, max: 100 }),
      percent: faker.datatype.number({ min: 0, max: 100 })
    }
  ],
  date: faker.date.recent()
})
