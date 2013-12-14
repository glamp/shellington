source "/home/vagrant/.bashrc"
while read line; do
  read userInput
  eval "$line"
done
