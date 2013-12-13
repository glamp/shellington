FROM base

RUN apt-get -y install software-properties-common python g++ make git
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get -y install nodejs

ADD . /shellington

EXPOSE 3000

RUN cd /shellington; npm install -g;

