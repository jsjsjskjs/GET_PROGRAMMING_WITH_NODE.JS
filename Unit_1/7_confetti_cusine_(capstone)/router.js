const httpStatus = require('http-status-codes'),
contentTypes = require('./content-types'),
utils = require('./utils')

const routes = {
    //입력 될 새로운 url들을 담아 줄 빈 객체를 만들어준다
    'GET': {},
    'POST': {}
}

exports.handle = (req, res) => {
    try {
        routes[req.method][req.url](req, res)        
    } catch (error) {
        res.writeHead(httpStatus.OK, contentTypes.html)
        utils.getFile("views/error.html", res)       
    }
}

exports.get = (url, action) => {
    routes['GET'][url] = action
}
exports.post = (url, action) => {
    routes['POST'][url] = action
}