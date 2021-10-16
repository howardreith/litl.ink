const { getAsync, setExpireAtAsync } = require('../repository/asyncRepository');

module.exports = async function getLink(hash) {
  const aWeek = 60 * 60 * 24 * 7;
  const url = await getAsync(hash);
  if (!url) {
    return null
  }
  await setExpireAtAsync(hash, aWeek);
  await setExpireAtAsync(url, aWeek);
  return url
};