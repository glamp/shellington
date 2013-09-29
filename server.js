
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
    var commandArgs = ""
      , command = "python";
    if (lang=="python") {
        commandArgs = path.join(root, "src/main.py");
    } else if (lang=="r") {
        commandArgs = path.join(root, "src/rmain.py");
    } else {
        commandArgs = path.join(root, "src/rubymain.rb");
        command = "ruby";
    }
    console.log(command + " " + commandArgs);
    child = spawn(command, [commandArgs]);
    child.stdin.write(JSON.stringify({"code": ""}) + "\n");

    sendToProcessServer = function(data) {
        var data = JSON.stringify(data);
        data = data.replace(/\n/g, "\\n")
        child.stdin.write(data + "\n");
    };
    
    var result = "";
    child.stdout.on("data", function(data) {
        data = data.toString().split('\n');
        if (data.length < 2) {
            result += data[0];
        } else {
            data = result + data[0];
            result = "";
            data = JSON.parse(data);
            if (_.has(data, "result")) {
                data.result = data.result.replace(/\\n/g, '\n');
            }
            if (_.has(completionCallbacks, data._id)) {
                completionCallbacks[data._id](data);
                delete completionCallbacks[data._id];
            }
        } 
    });

    completionCallbacks = {};
    app.get('/', function(req, res) {
      res.render('demo');
    });
    app.post('/', function(req, res) {
        var code = req.body.code
            autocomplete = req.body.autocomplete || false
          , data = { code: code, _id: uuid.v4(), autocomplete: autocomplete };
        
        completionCallbacks[data._id] = function(data) {
            res.json(data);
        }
        sendToProcessServer(data);
    });

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
}
