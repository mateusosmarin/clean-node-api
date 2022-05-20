import { AccountModel } from '@domain/models/account'
import { AddAccountParams } from '@domain/usecases/account/add-account'
import { AuthenticationParams } from '@domain/usecases/account/authentication'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  ...mockAddAccountParams()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAuthenticatedAccountModel = (): AccountModel => ({
  ...mockAccountModel(),
  accessToken: 'any_token'
})

export const mockAuthenticatedAdminAccountModel = (): AccountModel => ({
  ...mockAuthenticatedAccountModel(),
  role: 'admin'
})
