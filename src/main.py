import sys
from IPython.core.interactiveshell import InteractiveShell
import pandasjson as json
import StringIO

if __name__=="__main__":
    mode = "ipython"
    line = sys.stdin.readline()
    shell = InteractiveShell()
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
            if data.get("autocomplete")==True:
                _, completions = shell.complete(code)
                print json.dumps(completions)
            elif code.startswith("print"):
                #exec(code)
                shell.ex(code)
            else:
                try:
                    #print repr(eval(code))
                    print repr(shell.ev(code))
                except:
                    #exec(code)
                    shell.ex(code)
        except Exception, e:
            pass

        sys.stdout = sys.__stdout__
        data["result"] = codeOut.getvalue()
        data["result"] = data["result"].replace("\n", "\\n")
        sys.stdout.write(json.dumps(data) + "\n")
        sys.stdout.flush()

