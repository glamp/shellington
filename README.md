shellington
=============
node app for embedding in browser shells for different languages


<img src="http://fc03.deviantart.net/fs11/i/2006/166/9/4/Monocle_Man_by_SenorDoom.jpg">
*a picture of Lord Shellington himself*

## Running locally via the API
### run the app
```bash
# install node.js, python, ruby, etc.
$ git clone git@github.com:glamp/shellington.git
$ cd shellington
$ npm install -g
$ shellington python
# python /Users/glamp/repos/yhat/prototypes/pystudio/shellington/scripts/main.py c5c20a78-cd70-43aa-b396-552286e22621
# Express server listening on port 3000
```

## in browser
open localhost:3000 in your terminal

### calling with CURL
you can execute code via the REST API and it will talk to the python/ruby/bash/etc. subprocess
```bash
$ curl -X POST -H "Content-Type: application/json" -d '{"code": "x=1"}' localhost:3000/
{
  "autocomplete": false,
  "code": "x=1",
  "result": "",
  "_id": "d8caa768-7262-44ed-b27b-703c12cc7885"
}
$ curl -X POST -H "Content-Type: application/json" -d '{"code": "x"}' localhost:3000/
{
  "autocomplete": false,
  "code": "x",
  "result": "1\n",
  "_id": "99161acc-910a-4e58-b48a-530d996c216d"
}
$ curl -X POST -H "Content-Type: application/json" -d '{"code": "range(10)"}' localhost:3000/
{
  "autocomplete": false,
  "code": "range(10)",
  "result": "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\n",
  "_id": "5e4308a0-63b3-4fc4-9637-c71c8f9a418e"
}
```
## Running as a container
### build the container
this is the container that will be called from other apps

```bash
git clone git@github.com:glamp/shellington.git
cd shellington
sudo docker build -t shellington .
```

### `on('connection')`
when a user lands on the page, create a new docker for that user
and run node-sci

- create new docker
- assingn to tie user/docker

### `on('command')`
when the user inputs a command, execute it in their docker and display
it in the app

- post the user's docker container (will need some sort of lookup to
the container)
- curl -X POST -H "Content-Type: andpplication/json" -d '{"code":
"{USERS_CODE}"}' http://localhost:{USERS_CONTAINER_PORT}
- display it in the "terminal"


### `on('disconnect')`
when the user disconnects, kill the Dockerfile image

- sudo docker kill {USERS_CONTAINER_ID}

