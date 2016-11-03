var express = require('express');
var validUrl = require('valid-url');
var shortid = require('shortid');
var mongo = require('mongodb').MongoClient;
var dbURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url';
var port = process.env.PORT || 3000;
var baseURL = process.env.BASEURL || "";
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
    console.log(uri);
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
                short: short
            });
        });
    }
    else {
        res.json({
            error: "Invalid URL"
        });
    }
});

app.get('/:id',function(req,res){
    var urls = db.collection('urls');
    console.log('id',req.params.id);
    var raw = req.params.id;
    console.log('raw',raw);
    urls.find({short:raw}).toArray(function(err,arr){
        if(err) throw err;
        console.log(arr,raw.toString() , typeof raw);
        if(arr.length<1){
            
            //res.redirect('/');
        }
        else{
            res.redirect(arr[0].original);
        }
    })
})