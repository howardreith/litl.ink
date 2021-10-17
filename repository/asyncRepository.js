const redis = require('redis');

const client = redis.createClient(process.env.REDIS_URL);
const { promisify } = require('util');

client.on('connect', () => {
  // eslint-disable-next-line no-console
  console.info('Redis client connected');
});

client.on('error', (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
});

const expire = promisify(client.expire).bind(client);
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);

async function setExpireAtAsync(key, timeout) {
  return expire(key, timeout)
}

async function setAsync(key, value, timeout) {
  const setResult = await set(key, value);
  if (timeout) {
    await expire(key, timeout)
  }
  return setResult
}

async function getAsync(key) {
  return get(key);
}

module.exports = {
  getAsync,
  setAsync,
  setExpireAtAsync,
};
