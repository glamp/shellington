
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , uuid = require('uuid')
  , _ = require('underscore')
  , child_process = require("child_process")
  , spawn = child_process.spawn;

module.exports = function(root, lang) {
    console.log("running in root: " + root);
    lang = lang.toLowerCase();
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
    var cmd = "";
    console.log("staring with language: " + lang);
    if (lang=="python") {
        cmd = path.join(root, "src/main.py");
    } else {
        cmd = path.join(root, "src/rmain.py");
    }
    child = spawn("python", [cmd]);
    child.stdin.write(JSON.stringify({"code": "\n"}) + "\n");

    sendToProcessServer = function(data) {
        var data = JSON.stringify(data);
        data = data.replace(/\n/g, "\\n")
        child.stdin.write(data + "\n");
    };

    child.stdout.on("data", function(data) {
        data = data.toString().split('\n')[0];
        console.log(data)
        data = JSON.parse(data);
<<<<<<< HEAD
        if (_.has(data, "result")) {
            data.result = data.result.replace(/\\n/g, '\n');
        }
=======
        //data.result = data.result.replace(/\\n/g, '\n');
>>>>>>> 5ed9c62657294ebd3d3b815d72dad8271ac2fad8
        if (_.has(completionCallbacks, data._id)) {
            console.log(data);
            completionCallbacks[data._id](data);
            delete completionCallbacks[data._id];
        } else {
            console.log("no _id");
        }
    });

    completionCallbacks = {};
    app.get('/', function(req, res) {
      res.render('demo');
    });
    app.post('/', function(req, res) {
        var code = req.body.code
          , data = { code: code, _id: uuid.v4() };
        
        completionCallbacks[data._id] = function(data) {
          res.json(data);
        }
        sendToProcessServer(data);
    });

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
}
