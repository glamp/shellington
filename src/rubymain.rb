require 'rubygems'
require 'json'
require 'stringio'

context = binding

while line = STDIN.gets
  line = JSON.parse(line.strip())
  code = line["code"]
  #actualstdout, $stdout = $stdout, StringIO.new
  begin
    #result = eval(code) || ""
    result = $stdout = StringIO.new
    puts context.eval(code) || ""
    result.close_write
    result.rewind
  rescue Exception => e
    result = e.message
  end
  $stdout = STDOUT
  line["result"] = result.read

  STDOUT.write(JSON.dump(line) + "\n")
  STDOUT.flush
end

