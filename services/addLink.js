const { setAsync, getAsync, setExpireAtAsync } = require('../repository/asyncRepository');
const hashUrl = require('../utils/hashUrl');

module.exports = async function addLink(url) {
  const aWeek = 60 * 60 * 24 * 7;
  const currentValueInDb = await getAsync(url);
  if (currentValueInDb) {
    await setExpireAtAsync(url, aWeek)
    await setExpireAtAsync(currentValueInDb, aWeek)
    return currentValueInDb
  }
  const hash = hashUrl(url);
  await setAsync(hash, url, aWeek);
  await setAsync(url, hash, aWeek);
  return hash;
};