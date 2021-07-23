
export default {

  testTimeout: 30000,

  roots: ['<rootDir>/src/'],

  clearMocks: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  transform: {
    '.+\\.ts$': 'ts-jest'
  }

};
