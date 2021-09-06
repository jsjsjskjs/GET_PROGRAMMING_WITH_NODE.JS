const { urlencoded, static } = require('express')

// npm install express ejs --save 로 한 번에 설치
const express = require('express'),
app = express(),
homeController = require('./controllers/homeControllers'),
layouts = require('express-ejs-layouts'),
errorController = require('./controllers/errorController')

app.use(urlencoded({
    extended: false
}))
app.use(express.json())
app.use((req, res, next) => {
    console.log(`request made to: ${req.url}`)
    next()
})
app.use(layouts) // 레이아웃 미들웨어 추가
app.use(express.static('public')) // localhost:3000/404.html과 같이 바로 정적 에셋에 접근할 수 있다

app.set('view engine', 'ejs') // Express.js 애플리케이션에 뷰 엔진을 ejs로 설정
app.set('port', process.env.PORT || 3000) 

app.post('/', (req, res) => {
    console.log(req.body)
    console.log(req.query)
    res.send('POST Successful!')
})

//app.get('/name', homeController.respondWithName)
app.get('/name/:myName', homeController.respondWithName)
app.get('/items/:vegetable', homeController.sendReqParam)

app.use(errorController.logErrors)
app.use(errorController.resNoResourceFound)
app.use(errorController.resInternalError)

app.listen(app.get('port'), () => {
    console.log(`Server running at http://localhost:${app.get('port')}`) // app.set('port', process.env.PORT || 3000)을 이용 좀 더 동적인 명령문을 사용가능
})