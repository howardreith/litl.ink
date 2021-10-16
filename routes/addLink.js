const addLinkService = require('../services/addLink');

module.exports = function addLink(app) {
  app.post('/addLink', async (req, res) => {
    const { url } = req.body;
    const hash = await addLinkService(url);
    const builtUrl = `https://litl.ink/${hash}`;
    res.send({
      status: 'OK',
      builtUrl,
    });
  });
};