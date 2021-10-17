jest.mock('../repository/asyncRepository', () => ({
  getAsync: jest.fn(),
  setExpireAtAsync: jest.fn()
}));

describe('getLink', () => {
  const asyncRepository = require('../repository/asyncRepository');
  beforeEach(() => {
    process.env.ENVIRONMENT = 'DEVELOPMENT';
    asyncRepository.getAsync.mockResolvedValue(null);
    asyncRepository.setExpireAtAsync.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('returns null when there is no URL at a given hash', async () => {
    asyncRepository.getAsync.mockResolvedValue(null);
    const getLink = require('./getLink');
    const result = await getLink('abcdefgh');
    expect(result).toBeNull()
  });

  it('returns the URL when it is found', async () => {
    asyncRepository.getAsync.mockResolvedValue('https://howiereith.com');
    const getLink = require('./getLink');
    const result = await getLink('abcdefgh');
    expect(result).toEqual('https://howiereith.com')
  });

  it('sets the expire at back a week when the link is retrieved', async () => {
    asyncRepository.getAsync.mockResolvedValue('https://howiereith.com');
    const getLink = require('./getLink');
    await getLink('abcdefgh');
    expect(asyncRepository.setExpireAtAsync).toHaveBeenCalledTimes(2);
    expect(asyncRepository.setExpireAtAsync).toHaveBeenCalledWith("abcdefgh", 604800);
    expect(asyncRepository.setExpireAtAsync).toHaveBeenCalledWith("https://howiereith.com", 604800);
  })
});