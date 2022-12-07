const config = {
    bail: 1,
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: './src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '.module.ts',
        'main.ts',
        '.mock.ts',
        '.e2e-spec.ts',
        'config/*',
        'coverage/*',
        'index.ts'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '.module.ts',
        'main.ts',
        '.mock.ts',
        '.e2e-spec.ts',
        'config/*',
        'coverage/*',
    ],
    coverageDirectory: '../coverage',
    coverageReporters: ['text', 'cobertura', 'clover', 'lcov'],
    testEnvironment: 'node',
};

export default config;
