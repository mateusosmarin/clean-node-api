import { LoadSurveysRepository } from '@data/protocols/db/survey/load-surveys-repository'
import {
  AddSurveyParams,
  AddSurveyRepository
} from '@data/usecases/survey/add-survey/db-add-survey-protocols'
import { LoadSurveyByIdRepository } from '@data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { SurveyModel } from '@domain/models/survey'
import { mongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { ObjectID } from 'mongodb'

export class SurveyMongoRepository
implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async add (data: AddSurveyParams): Promise<void> {
    const surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await mongoHelper.getCollection('surveys')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return mongoHelper.map(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await mongoHelper.getCollection('surveys')
    const survey: SurveyModel = await surveyCollection.findOne({
      _id: new ObjectID(id)
    })
    return survey && mongoHelper.map(survey)
  }
}
