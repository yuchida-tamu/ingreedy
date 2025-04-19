const serverProj = require('./packages/server/package.json');

module.exports = {
  verbose: true,
  projects: [
    {
      preset: 'ts-jest',
      rootDir: './',
      coverageDirectory: './coverage/server',
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/packages/server/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/packages/server/src/$1',
      },
      testMatch: ['<rootDir>/packages/server/**/__tests__/**/*.test.ts'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: './packages/server/tsconfig.json',
          },
        ],
      },
    },
  ],
};
