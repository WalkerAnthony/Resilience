// loading necessary modules
var express = require('express');
var httpModule = require('http');

// create an express app
var app = express();

var http = httpModule.Server(app);

// Tells app that pictures, etc are located in folder 'assets'
app.use(express.static('assets'));

function respnder(req, res) {
  // Sending a file to the user's browser
  res.sendFile(__dirname + '/index.html');
  console.log('got a request');
};

// Get request to / is given to funtion 'responder'
app.get('/', responder);

function portListener() {
  console.log('Listening to localhost' + port);
}
var port = process.env.PORT || 3000;
http.listen(port, portListener);
