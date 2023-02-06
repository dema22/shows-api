/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.ts"], // tell jest where to find the test
  verbose: true, // indicate all test during the run
  forceExit: true,
  clearMocks: true, // clear mocks calls after each test
  resetMocks: true, // reset every mock after each test
  restoreMocks: true // restore each mock to its originally state after each test
};