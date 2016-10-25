var express = require('express');
var mongo = require('mongodb').MongoClient;
var dbURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url';
var app = express();
console.log('db URI: ',dbURI);
app.set('port', (process.env.PORT || 5000));