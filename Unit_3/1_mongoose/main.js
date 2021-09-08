const express = require('express'),
app = express(),
errorController = require('./controllers/errorController'),
homeController = require('./controllers/homeController'),
layouts = require('express-ejs-layouts'),
mongoose = require('mongoose'),
Subscriber = require('./models/subscribers')

mongoose.connect( 
    'mongodb://localhost:27017/recipe_db',
    {useNewUrlParser: true} //mongoose 5 버전부터는 업데이트가 되어 useNewUrlParser 옵션을 사용해주지 않으면 경고 메세지가 출력
)
const db = mongoose.connection // 변수에 데이터베이스 할당

db.once('open', () => {
    console.log('Successfully connected to MongoDB using Mongoose!')
})

let myQuery = Subscriber.findOne({
    name: 'Jae Sik'
})
.where('email', /gmail/)

myQuery.exec((err, data) => {
    if(data) console.log(data)
})

app.set('port', process.env.PORT || 3000)
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(layouts)
app.use(
    express.urlencoded({
        extended: false
    })
)
app.use(express.json())
app.use(homeController.logRequestPaths)

app.get('/name', homeController.respondWithName)
app.get('/items/:vegetable', homeController.sendReqParam)

app.post('/', (req, res) => {
    res.send('POST Successful!')
})

app.use(errorController.logErrors)
app.use(errorController.respondNoResourceFound)
app.use(errorController.respondInternalError)

app.listen(app.get('port'), () => {
    console.log(`Server running at http://localhost:${app.get('port')}`)
})











































