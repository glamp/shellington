`shellington`
=============

<img src="http://fc03.deviantart.net/fs11/i/2006/166/9/4/Monocle_Man_by_SenorDoom.jpg">

node app for embedding in browser shells for different languages

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

