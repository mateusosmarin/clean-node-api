import { SurveyModel } from '../../../../domain/usecases/load-surveys'

export interface LoadSurveysRepository {
  loadAll: () => Promise<SurveyModel[]>
}
