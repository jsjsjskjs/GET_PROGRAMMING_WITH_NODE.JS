const express = require('express'),
app = express(),
errorController = require('./controllers/errorController'),
homeController = require('./controllers/homeController'),
layouts = require('express-ejs-layouts'),
MongoDB = require('mongodb').MongoClient,
dbURL = 'mongodb://localhost:27017',
dbName = 'recipe_db' // 제공된 이름의 데이터베이스가 없다면 몽고DB는 앱에서 하나를 생성한다

MongoDB.connect(dbURL, (err, client) => {
    if(err) throw err
    let db = client.db(dbName)
    db.collection('contacts')
    .find() // find()에 대한 결과가 없다면 빈 배열이 반환된다
    .toArray((err, data) => {
        if(err) throw err
        console.log(data)
    })

    db.collection('contacts').insert({
        name: "Freddie Mercury",
        email: "fred@queen.com"
    },
    (err, db) => {
        if(err) throw err
        console.log(db)
    })
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











































