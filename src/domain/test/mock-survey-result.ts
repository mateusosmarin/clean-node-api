import { SurveyResultModel } from '@domain/models/survey-result'
import { SaveSurveyResultParams } from '@domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 1,
    percent: 50
  }, {
    image: 'other_image',
    answer: 'other_answer',
    count: 1,
    percent: 50
  }],
  date: new Date()
})

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 0,
    percent: 0
  }, {
    image: 'other_image',
    answer: 'other_answer',
    count: 0,
    percent: 0
  }],
  date: new Date()
})
