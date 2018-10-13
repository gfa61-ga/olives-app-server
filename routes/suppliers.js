var express = require('express');

var router = express.Router();

router.get('/getall', function(req, res) {
    var db = {};
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1', { useNewUrlParser: true }, function(err, client) {
        db.collection = client.db('olives').collection('suppliers');
        db.collection.find({}).toArray(function (err, doc) {
            if (err) {
                console.log(err); // LogError ????
            } else {
               //console.log(doc);
              res.json(doc);
            }
        });
    });
});

router.put('/update/:id', function(req, res) {
    var id = req.params.id;  //parseInt(req.params.id);  *** when _id is an integer
    var db = {};
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1', { useNewUrlParser: true }, function(err, client) {
        db.collection = client.db('olives').collection('suppliers');
        db.collection.findOneAndUpdate(
          {_id: id},
          {$set: {...req.body}},
          { returnOriginal: false }, function (err, doc) {
            if (err) {
                console.log(err);
            } else {
               //console.log(doc);
              res.status(200).json({"n": doc["lastErrorObject"]["n"], "updatedExisting": doc["lastErrorObject"]["updatedExisting"], "ok": doc["ok"]} ); //res.status(200).json(doc);
            }
        });
    });
});

router.post('/add', function(req, res) {
    var db = {};
    var MongoClient = require('mongodb').MongoClient;
//    res.status(200).json(req.body)

    MongoClient.connect('mongodb://127.0.0.1', { useNewUrlParser: true }, function(err, client) {
        db.collection = client.db('olives').collection('suppliers');
        console.log("Add:", req.body);
        db.collection.insertOne(req.body, function (err, doc) {
            if (err) {
                console.log(err);
            } else {
               //console.log(doc);
              res.status(200).json({"_id": doc["ops"][0]["_id"], "n": doc["result"]["n"], "ok": doc["result"]["ok"]});
            }
        });
    });
});

module.exports = router;