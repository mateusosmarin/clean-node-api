import { EmailInUseError } from '@presentation/errors'
import { LoadAccountByEmailRepository } from '@data/usecases/account/authentication/db-authentication-protocols'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Hasher
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const existingAccount = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email
    )
    if (existingAccount != null) {
      throw new EmailInUseError()
    }
    const password = await this.hasher.hash(accountData.password)
    const newAccount = await this.addAccountRepository.add({
      ...accountData,
      password
    })
    return newAccount
  }
}
