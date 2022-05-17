import 'module-alias/register'
import { mongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

mongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    const { port } = env
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  })
  .catch(console.error)
