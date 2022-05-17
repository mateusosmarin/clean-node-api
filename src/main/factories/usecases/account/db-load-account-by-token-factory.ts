import { DbLoadAccountByToken } from '@data/usecases/account/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '@domain/usecases/account/load-account-by-token'
import { JWTAdapter } from '@infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'
import env from '@main/config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JWTAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
