const addLinkService = require('../services/addLink');

module.exports = function addLink(app) {
  app.post('/addLink', async (req, res) => {
    const { url } = req.body;
    const builtUrl = await addLinkService(url);
    res.send({
      status: 'OK',
      builtUrl,
    });
  });
};