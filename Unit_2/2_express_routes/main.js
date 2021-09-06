const { urlencoded } = require('express')
const homeController = require('./controllers/homeController')

const port = 3000,
express = require('express'),
app = express()

app.use(urlencoded({
    extended: false
}))
app.use(express.json())

app.post('/', (req, res) => {
    console.log(req.body)
    // URL 경로의 끝 부분에 물음표를 붙이고 이 뒤에 연결된 값들을 취할 수 있게 한다
    // 이 값들을 쿼리 스트링이라고 부르며, 사이트에서 사용자의 행동을 추적하거나 사용자 방문 페이지의 일시적인 정보 저장을 위해 사용한다
    // ex) http://localhost:3000?cart=3&pagesVisited=4&utmcode=837623
    // req.query = { cart: '3', pagesVisited: '4', utmcode: '837623' }
    console.log(req.query)
    res.send('POST Successful!!')
})

app.get('/items/:vegetable', homeController.sendReqParam)

app.use((req, res, next) => { // 미들웨어 함수의 정의
    console.log(`request made to: ${req.url}`)
    next() // next 함수의 호출
    // 코드가 종료됐음을 Express.js에 알리기 위해새 마지막 부분의 next 함수의 호출은 필요하다
    // 이렇게 하지 않는다면 요청은 hang 상태로 남아 버린다
    // 미들웨어는 순차적으로 처리하기 때문에 next 함수를 호출하지 않으면 흐름이 막혀서 blocking 현상이 발생한다
})

app.listen(3000, () => {
    console.log(`Server running on port: ${port}`)
})