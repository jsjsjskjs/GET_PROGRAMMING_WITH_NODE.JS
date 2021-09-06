const port = 3000,
express = require('express'), // 애플리케이션에 express 모듈 추가
app = express() // 상수 app에 애플리케이션 할당

app.get('/', (req, res) => {
    console.log(req.params)
    console.log(req.body)
    console.log(req.url)
    console.log(req.query)
    res.send('Hello, Universe!')
})
.listen(port, () => {
    console.log(`The Express.js server has started and is listening on port number: ${port}`)
})