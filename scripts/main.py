import sys
import json
import StringIO

if __name__=="__main__":
    delim = sys.argv[1]
    line = True
    while line:
        # handle incoming data, parse it, and redirect
        # stdout so it doesn't interfere
        sys.stdout = sys.__stderr__
        line = sys.stdin.readline()
        data = json.loads(line)
        codeOut = StringIO.StringIO()
        sys.stdout = codeOut

        try:
            code = data.get("code")
            if code is None:
                sys.stderr.write("nothing given!")
                print "You give me nothing!"
            elif code.startswith("print"):
                exec(code)
            else:
                try:
                    print repr(eval(code))
                except:
                    exec(code)
        except Exception, e:
            sys.stderr.write(str(e))

        data["result"] = codeOut.getvalue()
        sys.stdout = sys.__stdout__
        sys.stdout.write(json.dumps(data) + delim)
        sys.stdout.flush()

