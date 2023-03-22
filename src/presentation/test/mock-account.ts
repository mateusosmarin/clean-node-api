import { AccountModel } from '@domain/models/account'
import { mockAccountModel } from '@domain/test'
import {
  AddAccount,
  AddAccountParams
} from '@domain/usecases/account/add-account'
import { LoadAccountByToken } from '@presentation/middlewares/auth-middleware-protocols'

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccountParams
  accountModel = mockAccountModel()

  async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = addAccountParams
    return this.accountModel
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role?: string
  accountModel: AccountModel | null = mockAccountModel()

  async load (
    accessToken: string,
    role?: string
  ): Promise<AccountModel | null> {
    this.accessToken = accessToken
    this.role = role
    return this.accountModel
  }
}
