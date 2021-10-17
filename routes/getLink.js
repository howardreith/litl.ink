const getLinkService = require('../services/getLink');

module.exports = function getLink(app) {
  app.get('/:hash', async (req, res) => {
    const hash = req.params.hash;
    const url = await getLinkService(hash);
    if (!url) {
      res.send({status: 'Not Found', message: `Could not find URL at value ${hash}`})
    } else {
      res.redirect(url)
    }
  });
};
