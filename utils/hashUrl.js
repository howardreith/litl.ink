module.exports = function hashUrl(url) {
  const now = new Date().getTime();
  const uniqueString = `${url}${now}`;
  let hval = 0x811c9dc5;
  for (let i = 0; i < uniqueString.length; i++) {
    hval ^= uniqueString.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
}