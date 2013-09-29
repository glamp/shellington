require 'rubygems'
require 'json'

context = binding

while line = STDIN.gets
  line = JSON.parse(line.strip())
  code = line["code"]
  begin
    #result = eval(code) || ""
    result = context.eval(code) || ""
    result = result.to_s
  rescue Exception => e
    result = e.message
  end
  line["result"] = result
  
  STDOUT.write(JSON.dump(line) + "\n")
  STDOUT.flush
end

