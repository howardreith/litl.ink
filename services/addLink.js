const { setAsync, getAsync, setExpireAtAsync } = require('../repository/asyncRepository');
const hashUrl = require('../utils/hashUrl');

module.exports = async function addLink(url) {
  const aWeek = 60 * 60 * 24 * 7;
  let currentValueInDb = await getAsync(url);
  if (currentValueInDb) {
    await setExpireAtAsync(url, aWeek);
    await setExpireAtAsync(currentValueInDb, aWeek);
    return currentValueInDb
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
  return hash;
};