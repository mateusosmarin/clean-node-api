import { InvalidParamError } from '@presentation/errors'
import {
  Controller,
  forbidden,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  ok,
  serverError
} from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(
        httpRequest.params.surveyId
      )
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }
}
