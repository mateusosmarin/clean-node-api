import { LoadSurveysRepository } from '@data/protocols/db/survey/load-surveys-repository'
import {
  AddSurveyModel,
  AddSurveyRepository
} from '@data/usecases/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@domain/models/survey'
import { mongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await mongoHelper.getCollection('surveys')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return surveys
  }
}
