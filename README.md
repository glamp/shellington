node-sci
========


node app sits on a server w/ a docker image for "node-sci"
app has 1 page - terminal w/ Yhat interactive tutorial

when a user lands on the page, create a new docker for that user
and run node-sci
on('connection')
-> create new docker
-> assingn to tie user/docker

when the user inputs a command, execute it in their docker and display
it in the app
on('command')
-> post the user's docker container (will need some sort of lookup to
the container)
-> curl -X POST -H "Content-Type: andpplication/json" -d '{"code":
"{USERS_CODE}"}' http://localhost:{USERS_CONTAINER_PORT}
-> display it in the "terminal"

when the user disconnects, kill the Dockerfile image
on('disconnect')
-> sudo docker kill {USERS_CONTAINER_ID}

