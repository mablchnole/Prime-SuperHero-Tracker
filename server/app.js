// dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Heroes = require('../models/heroes');
// get the express app
var app = express();

// URL to mongo db
var mongoURI = 'mongodb://localhost:27017/superhero-knowledge-db';
// connects to db & document store, returns object to give access to client
var MongoDB = mongoose.connect(mongoURI).connection;
// on error message
MongoDB.on('error', function(err){
  console.log('mongodb connection error:', err);
});
// once open success message
MongoDB.once('open', function(){
  console.log('mongodb connection open!');
});

// parse json
app.use(bodyParser.json());
// set static folder to public
app.use(express.static('public'));

// spin up the server
var server = app.listen(4242, 'localhost', function(req, res){
  console.log('server listening: 4242');
});

// base url to show path resolved index.html
app.get('/', function(req, res){
  res.sendFile(path.resolve('views/index.html'));
});

// post route to add new hero
app.post('/addHero', function(req, res){
  console.log('hit addHero post route, req.body: ', req.body.alias);
  // retrieved the req.body, put into object to be saved to db
  var addHeroRecord = {
    alias: req.body.alias,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    city: req.body.city,
    power_name: req.body.power_name
  };
  console.log('in addHeroRecord:', addHeroRecord);
  var newHeroRecord = Heroes(addHeroRecord);
  newHeroRecord.save();
  res.send(true);
}); // end addHero post route

// get route to retrieve hero data
app.get("/getHero", function(req, res){
  console.log('hit getHero get route');
  Heroes.find().then(function(data){
    res.send(data);
    console.log('in getHero route: ', data);
  });
}); // end getHero get route

// delete post route to delete hero by id
app.post('/deleteHero', function (req, res){
  console.log('in deleteHero route, req.body.id to delete:', req.body.id);
  Heroes.findOne({'_id': req.body.id}, function(err, Heroes){
    if(err){
      console.log(err);
    } else {
      Heroes.remove({'_id': req.body.id}, function(err){
        if(err){
          console.log('remove ' + err);
        } else {
          console.log('success');
        }
      });
    }
  });
}); // end deleteHero post route
