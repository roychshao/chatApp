module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.tsx'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/', '<rootDir>/public'],
}
