import { AddAccountRepository } from '@data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '@domain/models/account'
import { mockAccountModel } from '@domain/test'
import { AddAccountParams } from '@domain/usecases/account/add-account'

export class AddAccountRepositorySpy implements AddAccountRepository {
  account: AddAccountParams
  accountModel = mockAccountModel()

  async add (account: AddAccountParams): Promise<AccountModel> {
    this.account = account
    return this.accountModel
  }
}

export class LoadAccountByEmailRepositorySpy
implements LoadAccountByEmailRepository {
  email: string
  accountModel: AccountModel | null = mockAccountModel()

  async loadByEmail (email: string): Promise<AccountModel | null> {
    this.email = email
    return this.accountModel
  }
}

export class LoadAccountByTokenRepositorySpy
implements LoadAccountByTokenRepository {
  token: string
  role?: string
  accountModel: AccountModel | null = mockAccountModel()

  async loadByToken (
    token: string,
    role?: string
  ): Promise<AccountModel | null> {
    this.token = token
    this.role = role
    return this.accountModel
  }
}

export class UpdateAccessTokenRepositorySpy
implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}
