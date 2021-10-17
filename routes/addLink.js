const addLinkService = require('../services/addLink');

module.exports = function addLink(app) {
  app.post('/addLink', async (req, res) => {
    const { url } = req.body;
    const hash = await addLinkService(url);
    const environment = process.env.ENVIRONMENT;
    let builtUrl = `http://localhost:8080/${hash}`;
    if (environment === 'PRODUCTION') {
      builtUrl = `http://litl.ink/${hash}`
    }
    res.send({
      status: 'OK',
      builtUrl,
    });
  });
};