module.exports = {
    rootDir: './src',
    testMatch: ['<rootDir>/tests/test.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};
