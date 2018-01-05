'use strict';

/*eslint no-console: 0*/

var express = require('express');
var server = express();

server.use(express.static('./'));

module.exports = server;

