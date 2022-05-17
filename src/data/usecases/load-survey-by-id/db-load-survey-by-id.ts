import { LoadSurveyByIdRepository } from '@data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@domain/models/survey'
import { LoadSurveyById } from '@domain/usecases/load-survey-by-id'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveysRepository: LoadSurveyByIdRepository
  ) {}

  async loadById (id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveysRepository.loadById(id)
    return survey
  }
}
