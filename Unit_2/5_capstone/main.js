 const express = require('express'),
 app = express(),
 homeController = require('./controllers/homeController'),
 errorController = require('./controllers/errorController'),
 layouts = require('express-ejs-layouts')

app.set('view engine', 'ejs') // ejs를 사용하기 위한 애플리케이션 세팅
app.set('port', process.env.PORT || 3000)
app.use( // URL 인코드와 JSON 파라미터 처리를 위한 body-parser의 사용을 Express.js에 선언
    express.urlencoded({
        extended: false
    })
)
app.use(express.json())
app.use(layouts) //layouts 모듈 사용을 위한 애플리케이션 세팅
app.use(express.static('public')) // 동적 콘텐츠를 사용하기 위함 (404.html과 같은)

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/courses',homeController.showCourses)
app.get('/contact',homeController.showSignUp)
app.post('/contact',homeController.postedContactForm)

app.use(errorController.pageNotFoundError)
app.use(errorController.internalServerError)

app.listen(app.get('port'), () => {
    console.log(`Server running at http://localhost:${app.get('port')}`)
})