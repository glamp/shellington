fs = require 'fs'
path = require 'path'
package_json = JSON.parse fs.readFileSync path.join(__dirname, '../package.json')
server = require './server'
doc = """

Usage:
    shellington [options] <lang>

Options:
    --help
    --version

Description:
    #{package_json.description}

Example:

"""
{docopt} = require 'docopt', version: package_json.version
options = docopt doc

# defaults to python
server options["<lang>"] || "python"
