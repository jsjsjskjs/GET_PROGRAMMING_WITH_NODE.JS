exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName
    res.render('index', { name: paramsName }) // 사용자 정의 EJS 뷰를 사용한 응답
}

exports.sendReqParam = (req, res) => {
    let veg = req.params.vegetable
    res.send(`This is the page for ${veg}`)
}