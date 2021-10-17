jest.mock('../repository/asyncRepository', () => ({
  setAsync: jest.fn(),
  getAsync: jest.fn(),
  setExpireAtAsync: jest.fn()
}));
const {when} = require('jest-when');
jest.mock('../utils/hashUrl', () => jest.fn());


describe('addLink', () => {
  const asyncRepository = require('../repository/asyncRepository');
  const hashUrl = require('../utils/hashUrl');
  beforeEach(() => {
    process.env.ENVIRONMENT = 'DEVELOPMENT';
    asyncRepository.getAsync.mockResolvedValue(null);
    asyncRepository.setAsync.mockResolvedValue(null);
    asyncRepository.setExpireAtAsync.mockResolvedValue(null);
    hashUrl.mockReturnValue('abcdefgh')
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return a value already in db if present', async () => {
    const returnedHash = 'abcdefgh';
    asyncRepository.getAsync.mockResolvedValue(returnedHash);
    const addLink = require('./addLink');
    const result = await addLink('howiereith.com');
    expect(result).toEqual(`http://localhost:8080/${returnedHash}`)
  });

  it('should return a value already in db if present in production', async () => {
    process.env.ENVIRONMENT = 'PRODUCTION';
    const returnedHash = 'abcdefgh';
    asyncRepository.getAsync.mockResolvedValue(returnedHash);
    const addLink = require('./addLink');
    const result = await addLink('howiereith.com');
    expect(result).toEqual(`http://litl.ink/${returnedHash}`)
  });

  it('should keep looking for a clear hash if hash collision occurs', async () => {
    const returnedHash = 'abcdefgh';
    hashUrl.mockReturnValueOnce(returnedHash).mockReturnValue('another1')
    when(asyncRepository.getAsync).calledWith('howiereith.com').mockResolvedValue(null);
    when(asyncRepository.getAsync).calledWith(returnedHash)
      .mockResolvedValueOnce('https://banana.com')
      .mockResolvedValue(null);
    const addLink = require('./addLink');
    const result = await addLink('howiereith.com');
    expect(result).toEqual(`http://localhost:8080/another1`)
  });

  it('should update the database with the hash and the url', async () => {
    const addLink = require('./addLink');
    await addLink('howiereith.com');
    expect(asyncRepository.setAsync).toHaveBeenCalledTimes(2);
    expect(asyncRepository.setAsync).toHaveBeenCalledWith(expect.anything(), "howiereith.com", 604800);
    expect(asyncRepository.setAsync).toHaveBeenCalledWith("howiereith.com", expect.anything(), 604800);
  })
});