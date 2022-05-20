import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import docs from '../docs'

export default (app: Express): void => {
  app.use('/docs', serve, setup(docs))
}
