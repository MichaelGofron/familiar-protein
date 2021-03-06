var User = require('./userModel');
var bcrypt = require('bcrypt');
var utils = require('../lib/utilities');

var signup = function(req,res,next){
  console.log("req.body === ",req.body);
  User.findOne({username: req.body.username})
  .exec(function(err, data){
    if (err) { console.log("ERROR", err);}
    console.log("DATA === ", data);

    if (data === null) {
      bcrypt.hash(req.body.password, 8, function(err, hash){
        User.create({username: req.body.username, password: hash}, function (err, newUser) {
          if (err) {
            console.log("ERROR - ", err);
          } else {
            // Successfully created!
            console.log("Success! newUser === ", newUser);
            utils.createSession(req, res, data);
            res.statusCode = 201;
          }
        });
      });
    } else{
      // user already exists
      res.statusCode = 409;
      res.send({response: "Failure!"});
    }
  });
};

var login = function(req,res,next){
  // Get username and see if it exists
  User.findOne({username: req.body.username})
  .exec(function(err, data){
    if (err) { console.log("ERROR", err);}
    
    if (data !== null) {
      // check that the passwords match if so, log in else don't
      bcrypt.compare(req.body.password, data.password, function(err, match){
        if (err){console.log(err);}

        if (match){
          utils.createSession(req, res, data);
          res.statusCode = 200;
          console.log("SUCCESSFULLY LOGGED IN!");
          res.send({response: "SUCCESSFULLY LOGGED IN!"});
        }else{
          res.statusCode = 400;
          console.log("WRONG PASSWORD");
          res.send({response: "WRONG PASSWORD"});
        }
      });
    }else{
      res.statusCode = 400;
      console.log("WRONG USERNAME");
      res.send({response: "WRONG USERNAME"});
    }
  });
};

module.exports = {
  signup: signup,
  login: login
};
