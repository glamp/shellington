var express = require('express')
  , http = require('http')
  , path = require('path')
  , color = require('colors')
  , uuid = require('uuid')
  // TODO: just realized this isn't doing shit
  , delim = new Buffer(1).toString()  
  , _ = require('underscore')
  , WebSocketServer = require('ws').Server
  , child_process = require("child_process")
  , spawn = child_process.spawn;


module.exports = function(lang) {
  var app = express();

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '../public')));

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
  // wake up the subprocess
  child.stdin.write(JSON.stringify({"code": ""}) + '\n');

  sendToProcessServer = function(data) {
    var data = JSON.stringify(data);
    child.stdin.write(data + "\n");
  };

  var chunk = "";
  child.stdout.on("data", function(data) {
    chunk += data;
    // buffer the data
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
    // TODO: maybe do something cool with this on the client side?
    console.log(data.toString().cyan);
  });

  completionCallbacks = {};

  app.get('/', function(req, res) {
    res.render("demo");
  });

  app.get('/demo', function(req, res) {
    res.render("demo");
  });

  app.post('/', function(req, res) {
    var code = req.body.code
      , autocomplete = req.body.autocomplete || false
      , data = { code: code, _id: uuid.v4(), autocomplete: autocomplete };

    /* as you might have noticed, we don't actually respond to the client in 
     * this function (blasphemy, I know). what we actually do is create a 
     * "completionCallback" which is just a function that will ultimately return
     * JSON (`res.json`) to the client. the `_id` is *CRITICAL* here because 
     * the child that's reading stdout (see above) will use it to figure out
     * which callback to call.
     */
    completionCallbacks[data._id] = function(data) {
      res.json(data);
    }
    /*
     * This sends the data on it's merry way to the server. this is the first
     * contact that the data will have with the child process. ultimately it'll
     * be spit back out into stdout and we'll send it back to the appropriate
     * completionCallback
     */
    sendToProcessServer(data);
  });
  
  var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

  var wss = new WebSocketServer({ server: server });
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
