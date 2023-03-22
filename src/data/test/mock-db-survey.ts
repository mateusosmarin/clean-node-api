import { AddSurveyRepository } from '@data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@domain/models/survey'
import { mockSurveyModel, mockSurveysModel } from '@domain/test'
import { AddSurveyParams } from '@domain/usecases/survey/add-survey'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyParams

  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  surveyModel: SurveyModel = mockSurveyModel()

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.surveyModel
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveysModel: SurveyModel[] = mockSurveysModel()
  callCount = 0

  async loadAll (): Promise<SurveyModel[]> {
    this.callCount++
    return this.surveysModel
  }
}
