module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/ts-jest',
        '^.+\\.svg$': 'jest-transform-stub',
    },
    testRegex: [
        '/src/.*\\.spec.(ts|tsx|js)$',
        '/tests/.*\\.spec.(ts|tsx|js)$',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'scss'],
    // setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.ts'],
    collectCoverage: false,
    moduleNameMapper: {
        '\\.svg': '<rootDir>/tests/__mocks__/svgMock.js',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^.+.(svg|png|jpg)$': 'jest-transform-stub',
        '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    moduleDirectories: ['node_modules', 'src'],
    testEnvironment: 'jsdom',
};
