const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
// const xoauth2 = require('xoauth2');
const port = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static('resources'));

require('./config/sessions')(app);

app.set('view engine', 'ejs');

var routes_setter = require('./config/routes.js');
routes_setter(app);

app.listen(port, function() {
  console.log('Listening on', port);
});
