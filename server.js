'use strict';

// REQUIRES //
const babel       = require('babel-core').transform('code');
const express     = require('./server/config/express.js');
const environment = process.env.NODE_ENV;
// require('./server/config/db.js')();


// RUN EXPRESS //
const app = express();
//
// API TEST ROUTE //
app.get('/api/v1/test', (req, res) => {
  res.status(200).send('Light \'em up! We good to go!');
});

console.log('hello from server.js !');

// PORT //
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log('Check me out on port', port);
});