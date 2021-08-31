const routeResponseMap = {
    "/info": "<h1>Info Page</h1>",
    "/contact": "<h1>Contact Us</h1>",
    "/about":"<h1>Learn More About Us.</h1>",
    "/hello": "<h1>Say hello bt emailing us here</h1>",
    "/error": "<h1>Sorry the page you are looking for is not here.</h1>"
}
const port = 3000, // 애플리케이션이 사용할 port
http = require('http'), 
httpStatus = require('http-status-codes'), // http 상태코드를 나타내는 상수를 제공하기 위함
// npm install http-status-codes --save 로 설치
app = http.createServer((req, res) => { // createServer 함수를 사용해서 서버를 만들고 결과 서버를 app에 저장
    console.log("Received an incoming request!")
    res.writeHead(httpStatus.OK, { // 이 시스템은 httpStatus.OK 를 돌려준다. 이는 응답 코드 200으로 표현되며,
        // 서버가 요청을 성공적으로 받았고 HTML 형태의 콘텐츠로 응답을 한다는 것을 의미한다
        "Content-Type": "text/html"
    })
    if(routeResponseMap[req.url]) {
        res.end(routeResponseMap[req.url])
    } else {
        setTimeout(() => {
            res.end("<h1>Welcome!</h1>")
        }, 2000)
    }
})
app.listen(port);
console.log(`The server has started and is listening on port number: ${port}`)