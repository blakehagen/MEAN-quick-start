'use strict';

// EXPRESS //
const express    = require('express');
const session    = require('express-session');
const bodyParser = require('body-parser');
const cors       = require('cors');

module.exports = () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(session({
    secret: 'thisismysecretdonttellanyone1234aaa',
    resave: false,
    saveUninitialized: true
  }));
  app.use(express.static('build'));
  return app;
};