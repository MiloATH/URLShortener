var express = require('express');
var validUrl = require('valid-url');
var shortid = require('shortid');
var mongo = require('mongodb').MongoClient;
var dbURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url';
var port = process.env.PORT || 3000;
var baseURL = process.env.BASEURL;
var app = express();
var db;
console.log(baseURL);

//Set possible id characters
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

//connect to database
mongo.connect(dbURI, function(err,data){
    if(err) throw err;
    db = data;
    app.listen(port, function(){
        console.log('Listening on port ',port);
    });
});

app.get('/new/:uri',function(req,res){
    var uri = req.params.uri;
    if(validUrl.isUri(uri)){
        var urls = db.collection('urls');
        var shortUrl = urls.findOne({original:uri});
        if(1){//Check if there is a result from find //!shortUrl.short){
            urls.insert({original:uri,short:shortid.generate()});
            shortUrl = urls.findOne({original:uri});
        }
        res.json({original:uri,short: baseURL + shortUrl.short});
    }
    else{
        res.json({error: "Invalid URL"});
    }
})