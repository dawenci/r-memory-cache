module.exports = {
  moduleFileExtensions: [ 'js', 'jsx', 'json', 'ts', 'tsx' ],
  // 匹配 ts | tsx 文件
  transform: {
    // '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  // 忽略的目录
  transformIgnorePatterns: [ '/node_modules/' ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [ '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)' ],
  // 统计覆盖率
  collectCoverage: true,
  collectCoverageFrom: [ 'src/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**', '!src/**/*.d.ts' ],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  coverageReporters: [ 'lcov', 'text-summary' ],
  testURL: 'http://localhost/',
  // watchPlugins: [ 'jest-watch-typeahead/filename', 'jest-watch-typeahead/testname' ]
  // globals: {
  //   'ts-jest': {
  //     babelConfig: true
  //   }
  // }
}
