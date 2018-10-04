var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/suppliers', function(req, res) {
    var db = {};
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1', function(err, client) {
        db.collection = client.db('olives').collection('suppliers');
        db.collection.find({}).toArray(function (err, doc) {
            if (err) {
                console.LogError(err);
            } else {
               //console.log(doc);
              res.status(200).json(doc);
            }
        });
    });
});

app.get('/pickups', function(req, res) {
    var db = {};
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1', function(err, client) {
        db.collection = client.db('olives').collection('pickups');
        db.collection.find({}).toArray(function (err, doc) {
            if (err) {
                console.LogError(err);
            } else {
               //console.log(doc);
              res.status(200).json(doc);
            }
        });
    });
});

app.listen(3500);

// npm run dev   ** Whenever we make a change in the code and save,
//                * if nodemon is running, it'll restart the Node server with the new code
//               **
