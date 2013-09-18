import sys
import pandasjson as json
#import json
import StringIO

if __name__=="__main__":

    line = sys.stdin.readline()
    while line:
        # explicitly write to stdout
        sys.stdout.write(line)
        sys.stdout.flush()
        # handle incoming data, parse it, and redirect
        # stdout so it doesn't interfere
        line = sys.stdin.readline()
        data = json.loads(line)
        codeOut = StringIO.StringIO()
        sys.stdout = codeOut
        try:
            code = data["code"]
            if code.startswith("print"):
                exec(code)
            else:
                try:
                    print repr(eval(code))
                except:
                    exec(code)
        except Exception, e:
            pass

        sys.stdout = sys.__stdout__
        data["result"] = codeOut.getvalue()
        data["result"] = data["result"].replace("\n", "\\n")
        sys.stdout.write(json.dumps(data) + "\n")
        sys.stdout.flush()

