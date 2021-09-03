const fs = require('fs'),
httpStatus = require('http-status-codes'),
contentTypes = require('./content-types')

module.exports = {
    getFile: (file, res) => {
        fs.readFile(`./${file}`, (err, data) => {
            if(err) {
                res.writeHead(httpStatus.INTERNAL_SERVER_ERROR, contentTypes.html)
                res.end("There was an error serving content!")
            }
            res.end(data)
        })
    }
}