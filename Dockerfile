FROM base

RUN apt-get -y install software-properties-common python g++ make git
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get -y install nodejs

ADD . /node-sci
EXPOSE 3000
#RUN cd node-sci; node app.js

