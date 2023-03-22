import { SurveyModel } from '@domain/models/survey'
import { mockSurveyModel, mockSurveysModel } from '@domain/test'
import { AddSurvey, AddSurveyParams } from '@domain/usecases/survey/add-survey'
import { LoadSurveyById } from '@domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@domain/usecases/survey/load-surveys'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams

  async add (addSurveyParams: AddSurveyParams): Promise<void> {
    this.addSurveyParams = addSurveyParams
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  callCount = 0
  surveysModel: SurveyModel[] = mockSurveysModel()

  async load (): Promise<SurveyModel[]> {
    this.callCount++
    return this.surveysModel
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  id: string
  surveyModel: SurveyModel | null = mockSurveyModel()

  async loadById (id: string): Promise<SurveyModel | null> {
    this.id = id
    return this.surveyModel
  }
}
