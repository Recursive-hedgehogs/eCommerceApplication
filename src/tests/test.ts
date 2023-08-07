import * as packageJson from '../../package.json';

test('Husky is configured in package.json', () => {
    expect(packageJson.husky).toBeDefined();
});

test('Husky is installed and configured properly', () => {
    const huskyConfig = packageJson.husky;
    expect(huskyConfig.hooks['pre-commit']).toBeDefined();
    expect(huskyConfig.hooks['pre-commit']).toBe('lint');
});
