#!/bin/bash

if [[ -f "/home/vagrant/.bashrc" ]]; then
    source "/home/vagrant/.bashrc"
fi

while read line; do
  line=$(echo "$line" | jq .code | sed -e 's/^"//'  -e 's/"$//')
  script -q /dev/null $line | ./jsonify
done
