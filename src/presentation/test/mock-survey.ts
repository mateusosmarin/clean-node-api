import { SurveyModel } from '@domain/models/survey'
import { mockSurveyModel, mockSurveysModel } from '@domain/test'
import { AddSurvey, AddSurveyParams } from '@domain/usecases/survey/add-survey'
import { LoadSurveyById } from '@domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@domain/usecases/survey/load-surveys'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveysModel())
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return mockSurveyModel()
    }
  }
  return new LoadSurveyByIdStub()
}
