const httpStatus = require('http-status-codes'),
htmlContentType = {
    "Content-Type": "text/html"
},
routes = {
    //POST, GET 요청에 매핑된 라우트를 저장 할 routes 객체의 정의
    "GET": {
        "/info": (req, res) => {
            res.writeHead(httpStatus.OK, {
                "Content-Type": "text/plain"
            })
            res.end("Welcome ot the Info Page!")
        }
    },
    "POST": {}
}

//라우트에 따른 콜백 함수를 처리하기 위한 함수 handel생성
exports.handle = (req, res) => {
    try{
        if (routes[req.method][req.url]){
            routes[req.method][req.url](req,res)
        } else {
            res.writeHead(httpStatus.NOT_FOUND, htmlContentType)
            res.end("<h1>No such file exists</h1>")
        }
    } catch(ex) {
        console.log("error: " + ex)
    }
}
exports.get = (url, action) => {
    routes["GET"][url] = action
}
exports.post = (url, action) => {
    routes["POST"][url] = action
}