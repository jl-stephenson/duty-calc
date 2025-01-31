/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",

    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js",

    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  testPathIgnorePatterns: ["/node_modules", "/.next/"],

  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
