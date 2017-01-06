var express = require('express');
var validUrl = require('valid-url');
var shortid = require('shortid');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var dbURI = process.env.MONGOLAB_URI || require('../../sensitive_data/config').Mongo_URI || 'mongodb://localhost:27017/url';
var port = process.env.PORT || 3000;
var baseURL = process.env.BASEURL || '';
var app = express();
var db;

//Set possible id characters
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

//connect to database
mongo.connect(dbURI, function(err, data) {
    if (err) {
        throw err;
    }
    db = data;
    app.listen(port, function() {
        console.log('Listening on port', port);
    });
});

//Serve static content
app.use('/static', express.static(path.join(__dirname, 'public')));

//Set new short url
app.get('/new/*', function(req, res) {
    var uri = req.url.slice(5);
    var base = baseURL || ('http://' + req.get('host') + '/');
    if (validUrl.isUri(uri)) {
        var urls = db.collection('urls');
        var short;
        //See if there already exists a short for the  uri
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

//Create custom shortened URL.
//This will try to use a custom id for short.
//NOTE: Custom should be uri encoded and not have any escape characters.
app.get('/newCustom/:custom/old/*', function(req, res) {
    //Custom could be any length. So, /old/ is used as an anchor
    var indexOfOld = req.url.indexOf('/old/') + 5;
    var uri = req.url.substring(indexOfOld);
    var idealShort = req.params.custom;
    var base = baseURL || ('http://' + req.get('host') + '/');
    if (validUrl.isUri(uri)) {
        var urls = db.collection('urls');
        //Check custom short isn't already taken.
        urls.find({
            short: idealShort
        }).toArray(function(err, url) {
            if (err) throw err;
            if (url.length < 1) {
                urls.insert({
                    original: uri,
                    short: idealShort
                });
                res.json({
                    original: uri,
                    short: base + idealShort
                });
            }
            else {
                res.json({
                    error: ('The short ' + idealShort + ' is already taken.')
                });
            }
        });
    }
    else {
        res.json({
            error: "Invalid URL"
        });
    }
});

//API home
app.get('/api', function(req, res) {
    var file = path.join(__dirname, 'pages/index.html');
    res.sendFile(file, function(err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
});

//gui home to create shortened urls
app.get('/', function(req, res) {
    var file = path.join(__dirname, 'pages/home.html');
    res.sendFile(file, function(err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
});


//Access a page through the short
app.get('/:id', function(req, res) {
    var urls = db.collection('urls');
    var raw = req.params.id;
    urls.find({
        short: raw
    }).toArray(function(err, arr) {
        if (err) throw err;
        if (arr.length < 1) {
            res.redirect('/');
        }
        else {
            if (arr.length > 1) throw ("One short id to multiple URL. Short ID: " + raw) ;
            res.redirect(arr[0].original);
        }
    });
});
