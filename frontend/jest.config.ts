export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
    '^.+\\.svg$': 'jest-transformer-svg'
  },
  moduleNameMapper: {
    '^common/(.*)$': '<rootDir>/../common/$1',
    '^.+\\.svg\\?react$': 'jest-transformer-svg'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
