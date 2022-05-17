import { SurveyResultModel } from '@domain/models/survey-result'

export type SaveSurveyResultModel = Optional<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
