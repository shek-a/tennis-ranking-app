/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    // testMatch: ['**.test.ts'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1',
    },
    setupFiles: ['<rootDir>/jest/setEnvVars.ts'],
};
