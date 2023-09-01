module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    modulePaths: [
        "<rootDir>",
    ],
    moduleNameMapper: {
        "\\.(css|scss|html)$": '<rootDir>/testIgnore.ts',
        '.*iso.*3166.*': '<rootDir>/testIgnore.ts',
    },
    globals: { fetch }
};
