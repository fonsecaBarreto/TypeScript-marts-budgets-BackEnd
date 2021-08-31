
export default {

  testTimeout: 90000,

  roots: ['<rootDir>/test/', '<rootDir>/src'],

  clearMocks: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  transform: {
    '.+\\.ts$': 'ts-jest'
  }

};
