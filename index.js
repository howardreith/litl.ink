require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const mainPageController = require('./routes/index');
const addLinkController = require('./routes/addLink');
const getLinkController = require('./routes/getLink');

const app = express();
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  ciphers: "DEFAULT:!SSLv2:!RC4:!EXPORT:!LOW:!MEDIUM:!SHA1"
};

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up controllers
mainPageController(app);
addLinkController(app);
getLinkController(app);

// Start the Server
https.createServer(options, app).listen(443, () => {
  console.info('https server active on port 443')
});
http.createServer(app).listen(80, () => {
  console.info('http server active on port 80')
});
