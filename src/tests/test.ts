test('Husky is configured in package.json', () => {
    const packageJson = require('../../package.json');
    expect(packageJson.husky).toBeDefined();
});

test('Husky is installed and configured properly', () => {
    const packageJson = require('../../package.json');
    const huskyConfig = packageJson.husky;
    expect(huskyConfig.hooks['pre-commit']).toBeDefined();
    expect(huskyConfig.hooks['pre-commit']).toBe('lint');
});
