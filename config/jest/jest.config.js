module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../../',
  collectCoverage: false,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['json', 'text', 'text-summary'],
  collectCoverageFrom: ['src/**/*.ts', '!**/mock/*']
};
