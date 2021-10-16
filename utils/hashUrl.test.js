const hashUrl = require('./hashUrl');

describe('hashUrl', () => {
  it('should produce a unique 8-character hash from a string', () => {
    const string = 'aVeryFancyString';
    const result = hashUrl(string);
    expect(result.length).toEqual(8);
    const result2 = hashUrl(string);
    expect(result).not.toEqual(result2)
  })
});