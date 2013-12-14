child_process = require("child_process")
spawn = child_process.spawn


child = spawn("./bashmain.sh");

child.stdin.write(JSON.stringify({code: "ls"}) + "\n");

child.stdout.on('data', function(d) {
  console.log(d.toString());
});

