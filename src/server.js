/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , color = require('colors')
  , uuid = require('uuid')
  , delim = uuid.v4()
  , _ = require('underscore')
  , WebSocketServer = require('ws').Server
  , child_process = require("child_process")
  , spawn = child_process.spawn;


module.exports = function(lang) {
  var app = express();

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
  var commandArgs = ""
    , command = "";
  if (lang=="python") {
    commandArgs = path.join(__dirname, "../scripts/main.py");
    command = "python";
  } else if (lang=="r") {
    commandArgs = path.join(__dirname, "../scripts/rmain.r");
    command = "Rscript";
  } else if (lang=="ruby") {
    commandArgs = path.join(__dirname, "../scripts/rubymain.rb");
    command = "ruby";
  } else if (lang=="bashscript") {
    commandArgs = "";
    command = path.join(__dirname, "../scripts/bashmain.sh");
  }
  console.log(command + " " + commandArgs + " " + delim);

  if (lang=="bashscript") {
    child = spawn(command);
  } else {
    child = spawn(command, [commandArgs, delim]);
  }
  child.stdin.write(JSON.stringify({"code": ""}) + "\n");

  sendToProcessServer = function(data) {
    var data = JSON.stringify(data);
    child.stdin.write(data + "\n");
  };

  var chunk = "";
  child.stdout.on("data", function(data) {
    chunk += data;
    while (chunk.indexOf(delim) > 0) {
      var idx = chunk.indexOf(delim);
      var result = chunk.slice(0, idx);
      chunk = chunk.slice(idx + delim.length).trim();
      result = JSON.parse(result);
      if (_.has(result, "_id")) {
        callback = completionCallbacks[result._id];
        callback(result);
        delete completionCallbacks[result._id];
      }
    }
  });

  child.stderr.on("data", function(data) {
    console.log(data.toString().cyan);
  });

  completionCallbacks = {};

  app.get('/', function(req, res) {
    res.send({ status: "up" });
  });

  app.post('/', function(req, res) {
    var code = req.body.code
      , autocomplete = req.body.autocomplete || false
      , data = { code: code, _id: uuid.v4(), autocomplete: autocomplete };

    completionCallbacks[data._id] = function(data) {
      res.json(data);
    }
    sendToProcessServer(data);
  });
  
  var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

  var wss = new WebSocketServer({server: server});
  wss.on("connection", function (ws) {
    console.log("new client connection!");
    ws.on("message", function(data) {
      data = JSON.parse(data);
      data._id = uuid.v4();
      completionCallbacks[data._id] = function(data) {
        ws.send(JSON.stringify(data));
      }
      sendToProcessServer(data);
    });
  });
}
