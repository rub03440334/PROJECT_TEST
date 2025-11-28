module.exports = {
  projects: [
    {
      displayName: 'react-native',
      preset: 'jest-expo',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.d.ts',
        '!src/**/index.js',
      ],
    },
  ],
};
