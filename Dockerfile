FROM base

RUN apt-get -y install software-properties-common python g++ make git curl
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get -y install nodejs

# python
# already done above

# ruby
RUN apt-get -y install ruby1.9.3
RUN gem install json

# jq
RUN curl -o jq http://stedolan.github.io/jq/download/linux64/jq; chmod +x jq; mv jq /usr/local/bin

ADD . /shellington

RUN cd /shellington; npm install -g;

