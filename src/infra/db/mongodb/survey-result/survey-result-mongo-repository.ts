import { SaveSurveyResultRepository } from '@data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { SurveyResultModel } from '@domain/models/survey-result'
import { SaveSurveyResultParams } from '@domain/usecases/survey-result/save-survey-result'
import { mongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyResult: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await mongoHelper.getCollection('surveyResults')
    const res = await surveyResultCollection.findOneAndUpdate({
      surveyId: surveyResult.surveyId,
      accountId: surveyResult.accountId
    }, {
      $set: {
        answer: surveyResult.answer,
        date: surveyResult.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    return res.value && mongoHelper.map(res.value)
  }
}
