module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/@types/**',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/test/**',
    '!<rootDir>/src/**/*-protocols.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  watchPathIgnorePatterns: ['globalConfig'],
  moduleNameMapper: {
    '@data/(.*)': '<rootDir>/src/data/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@infra/(.*)': '<rootDir>/src/infra/$1',
    '@main/(.*)': '<rootDir>/src/main/$1',
    '@presentation/(.*)': '<rootDir>/src/presentation/$1',
    '@validation/(.*)': '<rootDir>/src/validation/$1'
  }
}
