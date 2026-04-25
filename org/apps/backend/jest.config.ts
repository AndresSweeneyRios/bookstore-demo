export default {
  displayName: '@org/backend',
  preset: '../../jest.preset.mjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'test-output/jest/coverage',
  moduleNameMapper: {
    '^jose$': 'jose-node-cjs-runtime',
    '^@libs/schema(.*)$': '<rootDir>/../../libs/schema$1',
  }
};
