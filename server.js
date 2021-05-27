// const { response } = require("express");
const express = require("express");
//const { setCartesian, sackurTetrodeDependencies } = require('mathjs');
const path = require("path");
const { v4: uuidv4 } = require("uuid");

var app = (module.exports = express());
var server = "http://localhost:3000";

// I got an error with line below if I didnt' add the extended property
// Don't actually know if this should be set to true or false.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/public')));

//TODO look into
// req.get('X-Forwarded-Protocol')

// Create new experiment
app.get("/api/experiment/newurl", function (req, res, next) {
  return res.send(server + "/static/criticalspacing/criticalspacing.html");
});

// get experiment
app.get("/criticalspacing/:experientid", function (req, res, next) {
  var experientid = req.params.experientid;
  res.sendFile(path.join(__dirname, "./public", "criticalspacing.html"));
});

// get experiment
app.get("/centering/:experientid", function (req, res, next) {
  var experientid = req.params.experientid;
  res.sendFile(
    // path.join(__dirname, "./public", "/centering", "centering.html")
    path.join(__dirname, "/public", "/centering", "centering.html")
  );
});

// Register New User
app.post("/register", (req, res) => {
  const username = req.body.username;
  var experimentid = uuidv4();

  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("criticalspacing");
    var myobj = [
      {
        username: username,
        experimentid: experimentid,
      },
    ];
    dbo.collection("experiment").insertMany(myobj, function (err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });

  return res.redirect("/criticalspacing/" + experimentid);
});

// Get experiment JSON from o.json file. This is a JSON/Matlab struct converted to JSON provided by Prof Pelli
app.get("/api/experimentdata", function (req, res, next) {
  var fs = require("fs");

  return res.send(JSON.parse(fs.readFileSync("o.json", "utf8")));
});

// Get Results of an experiment
app.get("/api/result/:experimentid", function (req, res, next) {
  var experientid = req.params.experientid;
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";
  var value;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("criticalspacing");
    var query = {
      experientid: experientid,
    };
    dbo
      .collection("experiment").find(query).toArray(function (err, result) {
      if (err) throw err;

      db.close();
      return res.send(value);

    });
  });

});

// Post final results of an experiment
app.post('/api/result/:experimentid', function (req, res, next) {
  var experimentid = req.params.experimentid;

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  var experimentdata = req.body;
  console.log(experimentdata);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;

    var dbo = db.db("criticalspacing");
    var query = {
      experimentid: experimentid
    };
    var newvalues = {
      $set: {
        experimentdata: experimentdata
      }
    };
    dbo.collection("experiment").updateOne(query, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });

});


//app.use('/remote', express.static(path.join(__dirname, '/remote')));
//app.set('views', path.join(__dirname, '/remote'));

// Map sessionID to the list of all responses
const responses = {}
// Map sessionID to the current stimulus fontFamily and alphabet 
const domains = {}

// Create a screen with a QR Code to for the user to scan.
// Not sure where this should go, ie the architecture of the experiments/how
// this will be called, so lmk if I should rework this
app.get('/remote/init/:sessionID', function (req, res) {
  res.render(path.join(__dirname, 'remote', 'qr.ejs'), {
    sessionID: req.params.sessionID,
    url: req.originalUrl,
    host: req.get('host'),
    protocol: 'https'
  });
});

// Link to the actual remote
// ie this is where the user will be sent (from the QR code) on their phone
app.get('/remote/:sessionID/:alphabet?/:fontFamily?', function (req, res) {
  if (!(req.params.sessionID in responses)) {
    responses[req.params.sessionID] = [];
    console.log('Session ID now in responses: ', (req.params.sessionID in responses));
  }
  // TEMORARY
  if (!(req.params.sessionID in domains)) {
    domains[req.params.sessionID] = {
      'fontFamily': 'Sloan', 
      'alphabet': 'ABCDEF'};
    // domains[req.params.sessionID] = {
    //   'fontFamily': 'Pelli', 
    //   'alphabet': '123456'};
  }
  console.log('responses: ', responses);
  console.log('domains: ', domains);
  console.log('protocol: ', req.protocol);
  // END TEMPORARY

  let alphabet = req.params.alphabet ? req.params.alphabet : domains[req.params.sessionID]['alphabet'];
  let fontFamily = req.params.fontFamily ? req.params.fontFamily : domains[req.params.sessionID]['fontFamily'];
  console.log('Getting alphabet: ', alphabet);

  res.render(path.join(__dirname, 'remote', 'remote.ejs'), {
    sessionID: req.params.sessionID,
    url: req.originalUrl,
    host: req.get('host'),
    protocol: 'https',
    fontFamily: fontFamily,
    alphabet: alphabet
  });
});


// Handle posts from the remote
// ie recieve the response the user pressed for this trial,
//    and response with the correct stimuli for the next trial.
app.post('/remote/:sessionID/:alphabet?/:fontFamily?', function (req, res) {
  // Log the response data
  responses[req.body.sessionID].push(req.body);

  console.log('From: ', req.body.sessionID);
  console.log('Recieved: ', req.body.responsePayload); 
  console.log('Time response sent: ', req.body.timeSent);
  console.log('Time response sent since start: ', req.body.elapsedStartToSend);

  let alphabet = 'alphabet' in req.params ? req.params.alphabet : domains[req.params.sessionID]['alphabet'];
  console.log('Posting alphabet: ', alphabet);
  let fontFamily = 'fontFamily' in req.params ? req.params.fontFamily : domains[req.params.sessionID]['fontFamily'];

  res.end(JSON.stringify({
    'sessionID': req.body.sessionID,
    'fontFamily': fontFamily,
      'alphabet': alphabet
  }));
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    error: err.message
  });
});

app.use(function (req, res) {
  res.status(404);
  res.send({
    error: "404 not found"
  });
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
