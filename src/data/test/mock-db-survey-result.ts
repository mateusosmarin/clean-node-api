import { SaveSurveyResultRepository } from '@data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@domain/models/survey-result'
import { mockSurveyResultModel } from '@domain/test'
import { SaveSurveyResultParams } from '@domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class AddSurveyRepositoryStub implements SaveSurveyResultRepository {
      async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return mockSurveyResultModel()
      }
    }
    return new AddSurveyRepositoryStub()
  }
