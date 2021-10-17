const { setAsync, getAsync, setExpireAtAsync } = require('../repository/asyncRepository');
const hashUrl = require('../utils/hashUrl');

module.exports = async function addLink(url) {
  const environment = process.env.ENVIRONMENT;
  const aWeek = 60 * 60 * 24 * 7;
  let currentValueInDb = await getAsync(url);
  if (currentValueInDb) {
    await setExpireAtAsync(url, aWeek);
    await setExpireAtAsync(currentValueInDb, aWeek);
    let builtUrl = `http://localhost:8080/${currentValueInDb}`;
    if (environment === 'PRODUCTION') {
      builtUrl = `http://litl.ink/${currentValueInDb}`
    }
    return builtUrl
  }
  let hash = hashUrl(url);
  let currentValueAtHash = await getAsync(hash);
  while (currentValueAtHash) {
    await new Promise(resolve => setTimeout(resolve, 2));
    // Hash is partly based on the current time. Waiting 2 milliseconds should produce a new hash
    hash = hashUrl(url);
    currentValueAtHash = await getAsync(hash)
  }

  await setAsync(hash, url, aWeek);
  await setAsync(url, hash, aWeek);

  let builtUrl = `http://localhost:8080/${hash}`;
  if (environment === 'PRODUCTION') {
    builtUrl = `http://litl.ink/${hash}`
  }

  return builtUrl;
};