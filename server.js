var express = require('express');
var validUrl = require('valid-url');
var shortid = require('shortid');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var dbURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url';
var port = process.env.PORT || 3000;
var baseURL = process.env.BASEURL ||'';
var app = express();
var db;
console.log(baseURL);

//Set possible id characters
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

//connect to database
mongo.connect(dbURI, function(err, data) {
    if (err) throw err;
    db = data;
    app.listen(port, function() {
        console.log('Listening on port', port);
    });
});

//Set new short url
app.get('/new/*', function(req, res) {
    var uri = req.url.slice(5);
    var base = baseURL || ('http://' + req.get('host') + '/');
    if (validUrl.isUri(uri)) {
        var urls = db.collection('urls');
        var short;
        urls.find({
            original: uri
        }).toArray(function(err, url) {
            if (err) throw err;
            if (url.length < 1) {
                short = shortid.generate();
                urls.insert({
                    original: uri,
                    short: short
                });
            }
            else {
                short = url[0].short;
            }
            res.json({
                original: uri,
                short: base + short
            });
        });
    }
    else {
        res.json({
            error: "Invalid URL"
        });
    }
});

app.get('/:id', function(req, res) {
    var urls = db.collection('urls');
    var raw = req.params.id;
    if (shortid.isValid(raw)) {
        res.redirect('/');
    }
    else {
        urls.find({
            short: raw
        }).toArray(function(err, arr) {
            if (err) throw err;
            if (arr.length < 1) {
                res.redirect('/');
            }
            else {
                if (arr.length > 1) throw "One short id to multiple URL";
                res.redirect(arr[0].original);
            }
        })
    }
});

app.get('/', function(req, res) {
    var file = path.join(__dirname, 'index.html');
    res.sendFile(file, function(err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
});