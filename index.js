require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
const mainPageController = require('./routes/index');
const addLinkController = require('./routes/addLink');
const getLinkController = require('./routes/getLink');

const port = process.env.PORT || 8080;
const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors(corsOptions));
app.use(bodyParser.json());

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

// Set up controllers
mainPageController(app);
addLinkController(app);
getLinkController(app);

http.createServer(app).listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Server Started. Listening on *:${port}`);
});