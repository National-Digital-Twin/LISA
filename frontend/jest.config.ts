export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
    '^.+\\.svg$': 'jest-transformer-svg'
  },
  moduleNameMapper: {
    '^common/(.*)$': '<rootDir>/../common/$1',
    '^(.*).svg\\?react$': '$1.svg'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '\\.svg$'],
  coverageReporters: ['text', 'text-summary', 'lcov', 'json'],
  testPathIgnorePatterns: ['\\.mock.ts$']
};
