import { SurveyResultModel } from '@domain/models/survey-result'
import { mockSurveyResultModel } from '@domain/test'
import { LoadSurveyResult } from '@domain/usecases/survey-result/load-survey-result'
import {
  SaveSurveyResult,
  SaveSurveyResultParams
} from '@domain/usecases/survey-result/save-survey-result'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  saveSurveyResultParams: SaveSurveyResultParams
  surveyResultModel: SurveyResultModel = mockSurveyResultModel()

  async save (saveSurveyResultParams: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultParams = saveSurveyResultParams
    return this.surveyResultModel
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  surveyResultModel: SurveyResultModel = mockSurveyResultModel()

  async load (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    return this.surveyResultModel
  }
}
