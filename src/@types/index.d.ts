type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

declare module Express {
  interface Request {
    accountId?: string
  }
}
