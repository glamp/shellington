FROM base

RUN apt-get -y install software-properties-common python g++ make git
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get -y install nodejs

# python

# ruby
RUN apt-get -y install ruby1.9.3
RUN gem install json

ADD . /shellington

RUN cd /shellington; npm install -g;

