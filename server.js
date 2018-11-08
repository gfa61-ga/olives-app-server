var express = require('express');
var cors = require('cors');

var socketIO = require('socket.io');
var http = require('http');

//var bodyParser = require('body-parser')
var app = express();
//var port = 3200;
var port = parseInt(process.env.PORT) + 1 || 3200;
var server = http.createServer(app);
var io = socketIO.listen(server,{origins:'*'});
server.listen(port);  // socket.io real-time server

io.on('connection', (socket) => {
  console.log('newClientConnected', socket.id);
  // send a message to everyone except from the current socket:
  /*socket.broadcast.emit('testTask', {
    name: 'test'
  }); */
});

module.exports.io = io; // we export 'io' object before we require 'suppliers',
                        // because 'suppliers.js' needs to import this 'io' object
/*** TODO:
      use Alternate solutions from:
   https://stackoverflow.com/questions/49519200/module-exports-gets-undefined-while-importing-on-another-file
***/

var suppliers = require('./routes/suppliers');
app.use(cors());

/*
  If you are using valid JSON and are POSTing it with Content-Type: application/json,
  then you can use the bodyParser middleware to parse the request body
  (request body is just an HTTP request of course, not the actual JSON)
  and place the result in request.body of your route.

  Starting with release 4.16.0, a new express.json() middleware is available.
*/

app.use(express.json()); // app.use(bodyParser.json());

app.use('/suppliers',  suppliers); //app.use('/suppliers',  suppliers);

/*
app.get('/pickups', function(req, res) {
  var db = {};
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(
    'mongodb://127.0.0.1',
    {useNewUrlParser: true},
    function(err, client) {
      db.collection = client.db('olives').collection('pickups');
      db.collection.find({}).toArray(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
           //console.log(doc);
          res.status(200).json(doc);
        }
      });
    }
  );
});
*/
/*
app.patch(...); // Update an item
app.delete(...); // Delete an item
*/

app.listen(process.env.PORT || 3500); // for localhost it will listen to port:3500 --> app.listen(3500);
// Heroku dynamically assigns your app a port, stored in: process.env.PORT




/*
var http = require('http');

var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Hello World');
});
server.listen(8080);
*/

/*************   to RUN the server:
// npm run dev   ** Whenever we make a change in the code and save,
//                * if nodemon is running, it'll restart the Node server with the new code
//               **

/*************   This works in windows porwershell:

$response = Invoke-RestMethod 'http://localhost:3500/suppliers/getall' -Method Get

$person = @{
    _id='123'
    lastName='doe'
  }

$json = $person | ConvertTo-Json

$response = Invoke-RestMethod 'http://localhost:3500/suppliers/add' -Method Post -Body $json -ContentType 'application/json'

$response
  123

$updperson = @{
    _id='123'
    lastName='doe'
    age=65
    city='mes'
    phone=12, 23, 34
  }

$json = $updperson | ConvertTo-Json

$response = Invoke-RestMethod 'http://localhost:3500/suppliers/update/123' -Method Put -Body $json -ContentType 'application/json'

$response
  lastErrorObject              value                                      ok
  ---------------              -----                                      --
  @{n=1; updatedExisting=True} @{_id=123; lastName=doe; age=65; city=mes}  1

*/
