module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!iso-3166)'],
};
